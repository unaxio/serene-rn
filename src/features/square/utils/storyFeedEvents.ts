import { AppState } from 'react-native';

import { reportStoryFeedEvents } from '@/src/features/square/api';
import {
  STORY_EVENT_BATCH_SIZE,
  STORY_EVENT_FLUSH_DELAY_MS,
} from '@/src/features/square/constants';
import type { StoryFeedEvent } from '@/src/features/square/types';

const queue: StoryFeedEvent[] = [];
let flushTimer: ReturnType<typeof setTimeout> | null = null;
let flushing = false;
let appStateBound = false;

function bindAppStateFlush(): void {
  if (appStateBound) {
    return;
  }
  appStateBound = true;
  AppState.addEventListener('change', (state) => {
    if (state !== 'active') {
      void flushStoryFeedEvents();
    }
  });
}

function sanitizeEvent(event: StoryFeedEvent): StoryFeedEvent | null {
  const storyId = event.storyId.trim();
  if (storyId.length === 0) {
    return null;
  }
  if (event.type !== 'read') {
    return { storyId, type: event.type };
  }
  const rawDwell = event.dwellMs ?? 0;
  const dwellMs = Number.isFinite(rawDwell) ? Math.max(0, Math.round(rawDwell)) : 0;
  return { storyId, type: 'read', dwellMs };
}

export function enqueueStoryFeedEvent(event: StoryFeedEvent): void {
  const next = sanitizeEvent(event);
  if (!next) {
    return;
  }
  bindAppStateFlush();
  queue.push(next);
  if (queue.length >= STORY_EVENT_BATCH_SIZE) {
    void flushStoryFeedEvents();
    return;
  }
  if (flushTimer) {
    return;
  }
  flushTimer = setTimeout(() => {
    flushTimer = null;
    void flushStoryFeedEvents();
  }, STORY_EVENT_FLUSH_DELAY_MS);
}

export async function flushStoryFeedEvents(): Promise<void> {
  if (flushTimer) {
    clearTimeout(flushTimer);
    flushTimer = null;
  }
  if (flushing || queue.length === 0) {
    return;
  }
  flushing = true;
  const batch = queue.splice(0, STORY_EVENT_BATCH_SIZE);
  try {
    await reportStoryFeedEvents(batch);
  } catch {
    // 重复上报会抬高曝光分母，失败不回队列；这是旁路统计，不打断浏览。
  } finally {
    flushing = false;
  }
  if (queue.length > 0) {
    await flushStoryFeedEvents();
  }
}
