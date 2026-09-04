import { isAxiosError, type AxiosError } from 'axios';

import { HTTP_STATUS, NETWORK_ERROR_MESSAGE } from '@/src/services/config';
import { showErrorToast } from '@/src/utils/toast';

interface ApiErrorBody {
  message?: string;
}

function isApiErrorBody(value: unknown): value is ApiErrorBody {
  return typeof value === 'object' && value !== null;
}

export function readApiErrorMessage(data: unknown): string | null {
  if (!isApiErrorBody(data) || typeof data.message !== 'string') {
    return null;
  }
  const message = data.message.trim();
  return message.length > 0 ? message : null;
}

export function toastAxiosFailure(error: AxiosError): void {
  const status = error.response?.status;
  if (status === HTTP_STATUS.UNAUTHORIZED) {
    return;
  }
  if (!error.response) {
    showErrorToast(NETWORK_ERROR_MESSAGE);
    return;
  }
  if (status !== undefined && status >= HTTP_STATUS.BAD_REQUEST) {
    showErrorToast(readApiErrorMessage(error.response.data) ?? NETWORK_ERROR_MESSAGE);
    return;
  }
  showErrorToast(NETWORK_ERROR_MESSAGE);
}

export function toastCaughtFailure(error: unknown): void {
  if (isAxiosError(error)) {
    return;
  }
  const message =
    error instanceof Error && error.message.trim().length > 0
      ? error.message
      : NETWORK_ERROR_MESSAGE;
  showErrorToast(message);
}
