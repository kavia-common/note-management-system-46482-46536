<template>
  <teleport to="body">
    <div v-if="state.open" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black/30" @click="onCancel"></div>
      <div class="relative card p-5 w-[92vw] max-w-md">
        <h3 class="text-lg font-semibold mb-2">{{ state.title }}</h3>
        <p class="text-gray-600 mb-4">{{ state.message }}</p>
        <div class="flex justify-end gap-2">
          <button class="btn btn-ghost" @click="onCancel">Cancel</button>
          <button
            class="btn"
            :class="state.variant === 'danger' ? 'text-white' : 'btn-primary'"
            :style="state.variant === 'danger' ? 'background: var(--op-error)' : ''"
            @click="onConfirm"
          >
            {{ state.confirmText || 'Confirm' }}
          </button>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { useUi } from '~/composables/useUi';
const { confirmState: state, resolveConfirm } = useUi();

function onCancel() {
  resolveConfirm(false);
}
function onConfirm() {
  resolveConfirm(true);
}
</script>
