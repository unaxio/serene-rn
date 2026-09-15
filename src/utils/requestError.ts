import { isAxiosError, type AxiosError } from 'axios';

import { HTTP_STATUS, NETWORK_ERROR_MESSAGE } from '@/src/services/config';
import { showErrorToast } from '@/src/utils/toast';

interface ApiErrorBody {
  message?: string;
  statusCode?: number;
}

const TOAST_DEDUP_MS = 800;

let lastToastMessage = '';
let lastToastAt = 0;

function isApiErrorBody(value: unknown): value is ApiErrorBody {
  return typeof value === 'object' && value !== null;
}

/** 从接口错误体取出 message（兼容对象 / JSON 字符串） */
export function readApiErrorMessage(data: unknown): string | null {
  if (typeof data === 'string') {
    const trimmed = data.trim();
    if (!trimmed) {
      return null;
    }
    try {
      return readApiErrorMessage(JSON.parse(trimmed) as unknown);
    } catch {
      return trimmed;
    }
  }
  if (!isApiErrorBody(data) || typeof data.message !== 'string') {
    return null;
  }
  const message = data.message.trim();
  return message.length > 0 ? message : null;
}

function showErrorToastOnce(message: string): void {
  const now = Date.now();
  if (message === lastToastMessage && now - lastToastAt < TOAST_DEDUP_MS) {
    return;
  }
  lastToastMessage = message;
  lastToastAt = now;
  showErrorToast(message);
}

/** 统一从任意错误取出可展示文案 */
export function resolveErrorMessage(error: unknown, fallback = NETWORK_ERROR_MESSAGE): string {
  if (isAxiosError(error)) {
    const status = error.response?.status;
    if (status === HTTP_STATUS.UNAUTHORIZED) {
      return fallback;
    }
    if (!error.response) {
      return NETWORK_ERROR_MESSAGE;
    }
    return readApiErrorMessage(error.response.data) ?? fallback;
  }
  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message.trim();
  }
  return fallback;
}

export function toastAxiosFailure(error: AxiosError): void {
  const status = error.response?.status;
  if (status === HTTP_STATUS.UNAUTHORIZED) {
    return;
  }
  showErrorToastOnce(resolveErrorMessage(error));
}

/**
 * catch / mutation.onError 统一入口。
 * Axios 错误也会展示 response.message（如 404「用户已注销」）；
 * 与拦截器重复触发时短时去重，避免连弹两次。
 */
export function toastCaughtFailure(error: unknown): void {
  if (isAxiosError(error)) {
    toastAxiosFailure(error);
    return;
  }
  showErrorToastOnce(resolveErrorMessage(error));
}
