<template>
  <div class="space-y-4">
    <section class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <button class="btn btn-ghost" @click="$router.push('/')">← Back</button>
        <h1 class="text-xl font-semibold">Edit Note</h1>
      </div>
      <div class="flex items-center gap-2">
        <button class="btn btn-ghost" @click="toggleFavoriteLocal">{{ note?.favorite ? '★ Unfavorite' : '☆ Favorite' }}</button>
        <button class="btn btn-ghost" @click="toggleArchiveLocal">{{ note?.archived ? 'Unarchive' : 'Archive' }}</button>
        <button class="btn btn-ghost text-error" @click="requestDeleteLocal">Delete</button>
        <button class="btn btn-primary" :disabled="saving" @click="save">Save</button>
      </div>
    </section>

    <NoteEditor
      v-if="note"
      v-model:title="title"
      v-model:content="content"
      v-model:tags="tags"
      :updated-at="note.updatedAt"
    />

    <div v-else class="card p-6">
      <p>Loading note...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useNotes } from '~/composables/useNotes';
import { useUi } from '~/composables/useUi';
import NoteEditor from '~/components/NoteEditor.vue';

const route = useRoute();
const router = useRouter();
const id = computed(() => route.params.id as string);

const { getById, updateNote, toggleFavoriteById, archiveById, removeById, loading } = useNotes();
const { confirm, toast } = useUi();

const note = ref<ReturnType<typeof getById> extends () => infer R ? R : any>(null);
const title = ref('');
const content = ref('');
const tags = ref<string[]>([]);
const saving = ref(false);

function load() {
  note.value = getById(id.value) || null;
  if (note.value) {
    title.value = note.value.title;
    content.value = note.value.content;
    tags.value = [...(note.value.tags || [])];
  }
}

watch(id, load, { immediate: true });

onMounted(() => {
  if (!note.value) {
    // in case of direct navigation, ensure notes are fetched first
    // useNotes fetch runs on index, but here we lazily rely on existing or mock
  }
});

async function save() {
  if (!note.value) return;
  saving.value = true;
  try {
    await updateNote(note.value.id, { title: title.value, content: content.value, tags: tags.value });
    toast.success('Note saved');
  } catch (e) {
    toast.error('Failed to save note');
  } finally {
    saving.value = false;
  }
}

async function toggleFavoriteLocal() {
  if (!note.value) return;
  await toggleFavoriteById(note.value.id);
  load();
}

async function toggleArchiveLocal() {
  if (!note.value) return;
  await archiveById(note.value.id);
  load();
}

function requestDeleteLocal() {
  if (!note.value) return;
  confirm({
    title: 'Delete note?',
    message: 'This action cannot be undone.',
    confirmText: 'Delete',
    variant: 'danger',
    onConfirm: async () => {
      await removeById(note.value.id);
      toast.success('Note deleted');
      router.push('/');
    },
  });
}
</script>
