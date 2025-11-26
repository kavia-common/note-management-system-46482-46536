import { ref } from 'vue';
import { apiClient } from '~/utils/apiClient';
import { useUi } from './useUi';

export type Note = {
  id: string
  title: string
  content: string
  tags: string[]
  favorite: boolean
  archived: boolean
  createdAt: string
  updatedAt: string
};

const notesRef = ref<Note[]>([]);
const loadingRef = ref(false);
let initialized = false;

function genId() { return Math.random().toString(36).slice(2); }

function nowIso() { return new Date().toISOString(); }

function mockSeed(): Note[] {
  const base = nowIso();
  return [
    { id: genId(), title: 'Welcome to Ocean Notes', content: 'This is a mock note. Configure NUXT_PUBLIC_API_BASE to use a real backend.', tags: ['intro', 'mock'], favorite: true, archived: false, createdAt: base, updatedAt: base },
    { id: genId(), title: 'Your second note', content: 'Try creating, editing and deleting notes.', tags: ['tips'], favorite: false, archived: false, createdAt: base, updatedAt: base },
  ];
}

// PUBLIC_INTERFACE
export function useNotes() {
  const { toast } = useUi();
  const client = apiClient();

  // PUBLIC_INTERFACE
  async function fetchNotes() {
    if (initialized) return;
    loadingRef.value = true;
    try {
      if (!client.hasBackend) {
        notesRef.value = mockSeed();
      } else {
        const res = await client.get<Note[]>('/notes');
        if (res.ok && Array.isArray(res.data)) {
          notesRef.value = res.data;
        } else {
          notesRef.value = mockSeed();
        }
      }
      initialized = true;
    } catch (e) {
      notesRef.value = mockSeed();
      toast.error('Failed to load notes, showing mock data');
    } finally {
      loadingRef.value = false;
    }
  }

  // PUBLIC_INTERFACE
  function getById(id: string) {
    return notesRef.value.find(n => n.id === id);
  }

  // PUBLIC_INTERFACE
  async function createNote(): Promise<Note> {
    const draft: Note = {
      id: genId(),
      title: 'Untitled',
      content: '',
      tags: [],
      favorite: false,
      archived: false,
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };
    // optimistic
    notesRef.value = [draft, ...notesRef.value];
    if (!client.hasBackend) {
      return draft;
    }
    const res = await client.post<Note>('/notes', draft);
    if (!res.ok || !res.data) {
      // rollback remove draft
      notesRef.value = notesRef.value.filter(n => n.id !== draft.id);
      throw new Error('Failed to create note');
    }
    // replace with server note (id may change)
    notesRef.value = [res.data, ...notesRef.value.filter(n => n.id !== draft.id)];
    return res.data;
  }

  // PUBLIC_INTERFACE
  async function updateNote(id: string, patch: Partial<Pick<Note, 'title' | 'content' | 'tags'>>) {
    const prev = notesRef.value.slice();
    const idx = notesRef.value.findIndex(n => n.id === id);
    if (idx === -1) return;
    const updated: Note = { ...notesRef.value[idx], ...patch, updatedAt: nowIso() };
    notesRef.value.splice(idx, 1, updated);

    if (!client.hasBackend) return;
    const res = await client.put<Note>(`/notes/${id}`, patch);
    if (!res.ok || !res.data) {
      notesRef.value = prev; // rollback
      throw new Error('Failed to update note');
    }
    notesRef.value.splice(idx, 1, { ...updated, ...res.data });
  }

  // PUBLIC_INTERFACE
  async function toggleFavoriteById(id: string) {
    const prev = notesRef.value.slice();
    const idx = notesRef.value.findIndex(n => n.id === id);
    if (idx === -1) return;
    const next = { ...notesRef.value[idx], favorite: !notesRef.value[idx].favorite, updatedAt: nowIso() };
    notesRef.value.splice(idx, 1, next);

    if (!client.hasBackend) return;
    const res = await client.put<Note>(`/notes/${id}/favorite`, { favorite: next.favorite });
    if (!res.ok) {
      notesRef.value = prev;
    }
  }

  // PUBLIC_INTERFACE
  async function archiveById(id: string) {
    const prev = notesRef.value.slice();
    const idx = notesRef.value.findIndex(n => n.id === id);
    if (idx === -1) return;
    const next = { ...notesRef.value[idx], archived: !notesRef.value[idx].archived, updatedAt: nowIso() };
    notesRef.value.splice(idx, 1, next);

    if (!client.hasBackend) return;
    const res = await client.put<Note>(`/notes/${id}/archive`, { archived: next.archived });
    if (!res.ok) {
      notesRef.value = prev;
    }
  }

  // PUBLIC_INTERFACE
  async function removeById(id: string) {
    const prev = notesRef.value.slice();
    notesRef.value = notesRef.value.filter(n => n.id !== id);

    if (!client.hasBackend) return;
    const res = await client.del<void>(`/notes/${id}`);
    if (!res.ok) {
      notesRef.value = prev;
      throw new Error('Failed to delete note');
    }
  }

  return {
    notes: notesRef,
    loading: loadingRef,
    fetchNotes,
    getById,
    createNote,
    updateNote,
    toggleFavoriteById,
    archiveById,
    removeById,
  };
}
