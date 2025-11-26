<template>
  <aside class="w-64 bg-app-surface border-r border-surface p-4 shadow-soft">
    <div class="mb-6">
      <div class="flex items-center gap-2">
        <div class="h-9 w-9 rounded-lg" :style="{ background: 'linear-gradient(135deg, rgba(37,99,235,.12), #fff)' }"></div>
        <div>
          <div class="font-bold">Ocean Notes</div>
          <div class="text-sm text-gray-500">Stay organized</div>
        </div>
      </div>
    </div>
    <nav class="space-y-1">
      <NuxtLink to="/" class="block px-3 py-2 rounded hover:bg-blue-50 hover:text-blue-700 transition">All Notes</NuxtLink>
      <button class="w-full text-left block px-3 py-2 rounded hover:bg-blue-50 hover:text-blue-700 transition opacity-60 cursor-not-allowed" title="Not implemented">Favorites</button>
      <button class="w-full text-left block px-3 py-2 rounded hover:bg-blue-50 hover:text-blue-700 transition opacity-60 cursor-not-allowed" title="Not implemented">Archived</button>
    </nav>
    <div class="mt-8 text-xs text-gray-500">
      <p>API: {{ apiBase || 'Mock (no backend configured)' }}</p>
    </div>
  </aside>
</template>

<script setup lang="ts">
const config = useRuntimeConfig();
const apiBase = config.public.apiBase;
</script>
