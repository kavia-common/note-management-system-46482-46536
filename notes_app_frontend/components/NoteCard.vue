<template>
  <div class="card p-4 hover:shadow-lg transition cursor-pointer" @click="$emit('open', note.id)">
    <div class="flex items-start justify-between gap-2">
      <div>
        <h3 class="font-semibold mb-1 line-clamp-1">{{ note.title || 'Untitled' }}</h3>
        <p class="text-sm text-gray-600 line-clamp-2">{{ preview }}</p>
      </div>
      <div class="flex items-center gap-2">
        <button class="text-yellow-500 hover:scale-110 transition" @click.stop="$emit('toggle-favorite', note.id)">{{ note.favorite ? '★' : '☆' }}</button>
        <button class="text-gray-500 hover:text-gray-800" @click.stop="$emit('archive', note.id)" title="Archive">🗄</button>
        <button class="text-error hover:scale-105" @click.stop="$emit('delete', note.id)" title="Delete">🗑</button>
      </div>
    </div>
    <div class="mt-3 flex flex-wrap gap-2">
      <span v-for="t in note.tags" :key="t" class="badge">#{{ t }}</span>
    </div>
    <div class="mt-2 text-xs text-gray-500">Updated {{ new Date(note.updatedAt).toLocaleString() }}</div>
  </div>
</template>

<script setup lang="ts">
type NoteCardType = {
  id: string
  title: string
  content: string
  tags: string[]
  favorite: boolean
  archived: boolean
  updatedAt: string
  createdAt: string
};

const props = defineProps<{ note: NoteCardType }>();
const emit = defineEmits(['open', 'toggle-favorite', 'archive', 'delete']);

const note = computed(() => props.note);
const preview = computed(() => (props.note?.content || '').slice(0, 140));
</script>
