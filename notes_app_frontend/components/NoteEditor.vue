<template>
  <div class="card p-4 md:p-6">
    <input
      class="input w-full mb-3 text-lg font-semibold"
      placeholder="Note title"
      v-model="localTitle"
    />
    <textarea
      class="w-full min-h-[220px] p-3 input"
      placeholder="Write your note... (Markdown-friendly)"
      v-model="localContent"
    />
    <div class="mt-3">
      <label class="block text-sm text-gray-600 mb-1">Tags (comma-separated)</label>
      <input class="input w-full" v-model="tagsInput" placeholder="e.g. work, personal" />
      <div class="mt-2 flex flex-wrap gap-2">
        <span v-for="t in modelTags" :key="t" class="badge">#{{ t }}</span>
      </div>
    </div>
    <div class="mt-4 text-xs text-gray-500">Last updated: {{ new Date(updatedAt).toLocaleString() }}</div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  title: string
  content: string
  tags: string[]
  updatedAt: string
}>();

const emit = defineEmits(['update:title', 'update:content', 'update:tags']);

const localTitle = computed({
  get: () => props.title,
  set: (v: string) => emit('update:title', v),
});

const localContent = computed({
  get: () => props.content,
  set: (v: string) => emit('update:content', v),
});

const modelTags = computed({
  get: () => props.tags || [],
  set: (v: string[]) => emit('update:tags', v),
});

const tagsInput = computed({
  get: () => (props.tags || []).join(', '),
  set: (v: string) => {
    const parts = v.split(',').map(s => s.trim()).filter(Boolean);
    modelTags.value = Array.from(new Set(parts));
  },
});
</script>
