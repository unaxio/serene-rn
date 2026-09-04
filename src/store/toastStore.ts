import { create } from 'zustand';

const TOAST_DURATION_MS = 2000;

interface ToastState {
  message: string | null;
  show: (message: string) => void;
  hide: () => void;
}

let hideTimer: ReturnType<typeof setTimeout> | null = null;

function clearHideTimer() {
  if (hideTimer) {
    clearTimeout(hideTimer);
    hideTimer = null;
  }
}

export const useToastStore = create<ToastState>((set) => ({
  message: null,
  show: (message: string) => {
    clearHideTimer();
    set({ message });
    hideTimer = setTimeout(() => {
      set({ message: null });
      hideTimer = null;
    }, TOAST_DURATION_MS);
  },
  hide: () => {
    clearHideTimer();
    set({ message: null });
  },
}));
