import { useToastStore } from '@/src/store/toastStore';

/**
 * 全局轻提示。用独立 Modal 盖在其它弹窗之上，避免 Alert 在 Web / RN Modal 下看不见。
 */
export function showToast(message: string, _title?: string): void {
  useToastStore.getState().show(message);
}

export function showErrorToast(message: string): void {
  showToast(message);
}
