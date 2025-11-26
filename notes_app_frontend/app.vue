<template>
  <div class="min-h-screen bg-app-bg text-app-text">
    <NuxtRouteAnnouncer />
    <div class="flex min-h-screen">
      <SidebarNav class="hidden md:flex" />
      <div class="flex-1 flex flex-col">
        <TopBar />
        <main class="p-4 md:p-6">
          <NuxtPage />
        </main>
      </div>
    </div>

    <ConfirmModal />
    <ToastContainer />
  </div>
</template>

<script setup lang="ts">
/**
 * Root App Shell:
 * - Injects Ocean Professional theme CSS vars
 * - Provides layout with Sidebar and TopBar
 * - Registers global UI components (toast, modal)
 */
</script>

<style>
/* Ocean Professional CSS variables (fallback if Tailwind not present) */
:root {
  --op-primary: #2563EB;
  --op-secondary: #F59E0B;
  --op-success: #F59E0B;
  --op-error: #EF4444;
  --op-text: #111827;
  --op-bg: #f9fafb;
  --op-surface: #ffffff;
  --op-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.08), 0 4px 6px -4px rgb(0 0 0 / 0.06);
}

.bg-app-bg { background: var(--op-bg); }
.bg-app-surface { background: var(--op-surface); }
.text-app-text { color: var(--op-text); }
.text-primary { color: var(--op-primary); }
.text-error { color: var(--op-error); }
.text-success { color: var(--op-success); }
.border-surface { border-color: #e5e7eb; }

/* Gradient utility used by headers and accents */
.op-gradient {
  background-image: linear-gradient(to bottom right, rgba(59,130,246,0.1), #f8fafc);
}

/* Transitions */
.page-enter-active, .page-leave-active { transition: opacity .2s, transform .2s; }
.page-enter-from, .page-leave-to { opacity: 0; transform: translateY(4px); }

/* Minimal utility classes when Tailwind is unavailable */
.rounded { border-radius: .5rem; }
.rounded-md { border-radius: .75rem; }
.rounded-lg { border-radius: 1rem; }
.shadow-soft { box-shadow: var(--op-shadow);}
.btn {
  display: inline-flex; align-items: center; gap: .5rem;
  padding: .5rem .9rem; border-radius: .5rem;
  transition: all .2s ease; font-weight: 600;
}
.btn-primary { background: var(--op-primary); color: white; }
.btn-primary:hover { filter: brightness(0.98); transform: translateY(-1px); }
.btn-ghost { background: transparent; color: var(--op-primary); }
.btn-ghost:hover { background: rgba(37,99,235,0.08); }
.input, textarea {
  background: var(--op-surface); border: 1px solid #e5e7eb; border-radius: .5rem;
  padding: .5rem .75rem; transition: border .2s, box-shadow .2s;
}
.input:focus, textarea:focus { outline: none; border-color: var(--op-primary); box-shadow: 0 0 0 3px rgba(37,99,235,0.15); }
.badge {
  display: inline-block; padding: .125rem .5rem; border-radius: 9999px;
  background: #eff6ff; color: #1d4ed8; border: 1px solid #dbeafe; font-size: .75rem;
}
.card { background: var(--op-surface); border: 1px solid #e5e7eb; border-radius: .75rem; box-shadow: var(--op-shadow); }
</style>
