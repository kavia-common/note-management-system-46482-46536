<template>
  <div class="space-y-4">
    <section class="card p-4 md:p-5 op-gradient">
      <div class="flex flex-col md:flex-row md:items-center gap-3 justify-between">
        <div class="flex-1 flex items-center gap-3">
          <input v-model="query" placeholder="Search notes (title or content)..." class="input w-full" @input="onSearch" />
          <button class="btn btn-primary" @click="createNew">New Note</button>
        </div>
        <div class="flex items-center gap-2 flex-wrap">
          <span v-for="t in allTags" :key="t" class="badge cursor-pointer" :class="{'!bg-blue-50 !text-blue-700 !border-blue-200': activeTags.has(t)}" @click="toggleTag(t)">
            #{{ t }}
          </span>
          <button class="btn btn-ghost" @click="clearFilters">Clear</button>
        </div>
      </div>
    </section>

    <NotesList
      :notes="filteredSortedNotes"
      :loading="loading"
      :empty-text="emptyText"
      @toggle-favorite="toggleFavorite"
      @archive="archiveNote"
      @delete="requestDelete"
      @open="openNote"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import NotesList from '~/components/NotesList.vue';
import { useNotes } from '~/composables/useNotes';
import { useUi } from '~/composables/useUi';

const router = useRouter();
const { notes, fetchNotes, createNote, toggleFavoriteById, archiveById, removeById, loading } = useNotes();
const { confirm, toast } = useUi();

const query = ref('');
const activeTags = ref<Set<string>>(new Set());

const allTags = computed(() => {
  const set = new Set<string>();
  notes.value.forEach(n => n.tags?.forEach(t => set.add(t)));
  return Array.from(set).sort();
});

const filteredSortedNotes = computed(() => {
  const q = query.value.trim().toLowerCase();
  const tagFilter = activeTags.value;
  let res = notes.value.filter(n => {
    const matchQ = !q || n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q);
    const matchTags = tagFilter.size === 0 || (n.tags || []).some(t => tagFilter.has(t));
    return matchQ && matchTags && !n.archived;
  });
  res = res.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  return res;
});

const emptyText = computed(() => {
  if (loading.value) return 'Loading notes...';
  if (notes.value.length === 0) return 'No notes yet. Create your first note!';
  if (filteredSortedNotes.value.length === 0) return 'No notes match your filters.';
  return '';
});

function onSearch() {/* debounce optional */}

function toggleTag(tag: string) {
  const next = new Set(activeTags.value);
  if (next.has(tag)) next.delete(tag); else next.add(tag);
  activeTags.value = next;
}

function clearFilters() {
  activeTags.value = new Set();
  query.value = '';
}

async function createNew() {
  const note = await createNote();
  router.push(`/notes/${note.id}`);
}

async function toggleFavorite(id: string) {
  await toggleFavoriteById(id);
}

async function archiveNote(id: string) {
  await archiveById(id);
}

function requestDelete(id: string) {
  confirm({
    title: 'Delete note?',
    message: 'This action cannot be undone.',
    confirmText: 'Delete',
    variant: 'danger',
    onConfirm: async () => {
      await removeById(id);
      toast.success('Note deleted');
    },
  });
}

function openNote(id: string) {
  router.push(`/notes/${id}`);
}

onMounted(() => {
  fetchNotes();
});
</script>
