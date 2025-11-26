<template>
  <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
    <template v-if="loading">
      <div v-for="i in 6" :key="i" class="card p-4 animate-pulse">
        <div class="h-4 w-2/3 bg-gray-200 rounded mb-2"></div>
        <div class="h-3 w-full bg-gray-100 rounded mb-1"></div>
        <div class="h-3 w-5/6 bg-gray-100 rounded"></div>
      </div>
    </template>
    <template v-else-if="notes.length === 0">
      <div class="col-span-full card p-6 text-center text-gray-600">
        {{ emptyText || 'Nothing here yet.' }}
      </div>
    </template>
    <template v-else>
      <NoteCard
        v-for="n in notes"
        :key="n.id"
        :note="n"
        @toggle-favorite="$emit('toggle-favorite', $event)"
        @archive="$emit('archive', $event)"
        @delete="$emit('delete', $event)"
        @open="$emit('open', $event)"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import NoteCard from './NoteCard.vue';

defineProps<{
  notes: any[],
  loading?: boolean,
  emptyText?: string
}>();
defineEmits(['toggle-favorite', 'archive', 'delete', 'open']);
</script>
