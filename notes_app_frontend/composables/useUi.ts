import { ref, reactive } from 'vue';

type ToastType = 'info' | 'success' | 'error';

type Toast = {
  id: string
  type: ToastType
  title: string
  message: string
  timeout?: number
};

const toastsRef = ref<Toast[]>([]);

const confirmState = reactive<{
  open: boolean
  title: string
  message: string
  confirmText?: string
  variant?: 'default' | 'danger'
  resolver?: ((v: boolean) => void) | null
}>({
  open: false,
  title: '',
  message: '',
  confirmText: 'Confirm',
  variant: 'default',
  resolver: null,
});

// PUBLIC_INTERFACE
export function useUi() {
  function notify(t: Omit<Toast, 'id'>) {
    const id = Math.random().toString(36).slice(2);
    const toast = { id, ...t };
    toastsRef.value.push(toast);
    const timeout = t.timeout ?? 3500;
    if (timeout > 0) {
      setTimeout(() => dismissToast(id), timeout);
    }
    return id;
  }

  // PUBLIC_INTERFACE
  function toastInfo(message: string, title = 'Info') { return notify({ type: 'info', title, message }); }
  // PUBLIC_INTERFACE
  function toastSuccess(message: string, title = 'Success') { return notify({ type: 'success', title, message }); }
  // PUBLIC_INTERFACE
  function toastError(message: string, title = 'Error') { return notify({ type: 'error', title, message }); }

  function dismissToast(id: string) {
    toastsRef.value = toastsRef.value.filter(t => t.id !== id);
  }

  // PUBLIC_INTERFACE
  function confirm(opts: { title: string; message: string; confirmText?: string; variant?: 'default' | 'danger'; onConfirm?: () => void; onCancel?: () => void; }) {
    return new Promise<boolean>((resolve) => {
      confirmState.open = true;
      confirmState.title = opts.title;
      confirmState.message = opts.message;
      confirmState.confirmText = opts.confirmText ?? 'Confirm';
      confirmState.variant = opts.variant ?? 'default';
      confirmState.resolver = (v: boolean) => {
        if (v && opts.onConfirm) opts.onConfirm();
        if (!v && opts.onCancel) opts.onCancel();
        resolve(v);
      };
    });
  }

  function resolveConfirm(v: boolean) {
    confirmState.open = false;
    confirmState.resolver?.(v);
    confirmState.resolver = null;
  }

  return {
    // toasts
    toasts: toastsRef,
    notify,
    toast: { info: toastInfo, success: toastSuccess, error: toastError },
    dismissToast,
    // confirm
    confirmState,
    confirm,
    resolveConfirm,
  };
}
