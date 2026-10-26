import { AppState } from 'react-native';

import { reportContentEvents } from '@/src/features/square/api';
import {
  CONTENT_EVENT_BATCH_SIZE,
  CONTENT_EVENT_FLUSH_DELAY_MS,
} from '@/src/features/square/constants';
import type { ContentEvent, ContentEventTargetType } from '@/src/features/square/types';
import { useAuthStore } from '@/src/store/authStore';

const TARGET_TYPES: readonly ContentEventTargetType[] = ['share', 'ask_answer'];

const queue: ContentEvent[] = [];
let flushTimer: ReturnType<typeof setTimeout> | null = null;
let flushing = false;
let appStateBound = false;

function signedIn(): boolean {
  const token = useAuthStore.getState().accessToken;
  return typeof token === 'string' && token.length > 0;
}

function bindAppStateFlush(): void {
  if (appStateBound) {
    return;
  }
  appStateBound = true;
  AppState.addEventListener('change', (state) => {
    if (state !== 'active') {
      void flushContentEvents();
    }
  });
}

function sanitizeEvent(event: ContentEvent): ContentEvent | null {
  if (!TARGET_TYPES.includes(event.targetType)) {
    return null;
  }
  const targetId = event.targetId.trim();
  if (targetId.length === 0) {
    return null;
  }
  if (event.type !== 'read') {
    return { targetType: event.targetType, targetId, type: event.type };
  }
  const rawDwell = event.dwellMs ?? 0;
  const dwellMs = Number.isFinite(rawDwell) ? Math.max(0, Math.round(rawDwell)) : 0;
  return { targetType: event.targetType, targetId, type: 'read', dwellMs };
}

export function enqueueContentEvent(event: ContentEvent): void {
  if (!signedIn()) {
    return;
  }
  const next = sanitizeEvent(event);
  if (!next) {
    return;
  }
  bindAppStateFlush();
  queue.push(next);
  if (queue.length >= CONTENT_EVENT_BATCH_SIZE) {
    void flushContentEvents();
    return;
  }
  if (flushTimer) {
    return;
  }
  flushTimer = setTimeout(() => {
    flushTimer = null;
    void flushContentEvents();
  }, CONTENT_EVENT_FLUSH_DELAY_MS);
}

export async function flushContentEvents(): Promise<void> {
  if (flushTimer) {
    clearTimeout(flushTimer);
    flushTimer = null;
  }
  if (flushing || queue.length === 0) {
    return;
  }
  flushing = true;
  const batch = queue.splice(0, CONTENT_EVENT_BATCH_SIZE);
  try {
    await reportContentEvents(batch);
  } catch {
    // 失败不回队列，避免把同一次曝光反复累加。
  } finally {
    flushing = false;
  }
  if (queue.length > 0) {
    await flushContentEvents();
  }
}
