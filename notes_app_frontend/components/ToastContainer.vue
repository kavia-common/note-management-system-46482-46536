<template>
  <teleport to="body">
    <div class="fixed top-3 right-3 z-50 space-y-2 w-[92vw] max-w-sm">
      <div
        v-for="t in toasts"
        :key="t.id"
        class="card px-4 py-3 flex items-start gap-2"
        :style="t.type === 'error' ? 'border-color: #fecaca; background:#fff1f2' : t.type === 'success' ? 'border-color:#bbf7d0; background:#f0fdf4' : ''"
      >
        <div v-if="t.type === 'error'">❌</div>
        <div v-else-if="t.type === 'success'">✅</div>
        <div v-else>ℹ️</div>
        <div class="flex-1">
          <div class="font-medium">{{ t.title }}</div>
          <div class="text-sm text-gray-700">{{ t.message }}</div>
        </div>
        <button class="text-gray-500 hover:text-gray-800" @click="dismiss(t.id)">✖</button>
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { useUi } from '~/composables/useUi';
const { toasts, dismissToast } = useUi();

function dismiss(id: string) {
  dismissToast(id);
}
</script>
