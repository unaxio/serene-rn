import { useCallback, useEffect, useRef } from 'react';

import {
  STORY_IMPRESSION_MIN_RATIO,
  STORY_IMPRESSION_MIN_VISIBLE_MS,
} from '@/src/features/square/constants';
import { storyVisibleRatio } from '@/src/features/square/utils/storyCardVisibility';
import { enqueueStoryFeedEvent } from '@/src/features/square/utils/storyFeedEvents';

interface CardFrame {
  y: number;
  height: number;
}

export function useStoryFeedImpressions(storyIds: readonly string[], enabled: boolean) {
  const framesRef = useRef(new Map<string, CardFrame>());
  const localFramesRef = useRef(new Map<string, CardFrame>());
  const masonryOffsetRef = useRef(0);
  const viewportRef = useRef({ offsetY: 0, height: 0 });
  const timersRef = useRef(new Map<string, ReturnType<typeof setTimeout>>());
  const impressedRef = useRef(new Set<string>());
  const enabledRef = useRef(enabled);
  enabledRef.current = enabled;

  const clearTimer = useCallback((storyId: string) => {
    const timer = timersRef.current.get(storyId);
    if (!timer) {
      return;
    }
    clearTimeout(timer);
    timersRef.current.delete(storyId);
  }, []);

  const evaluate = useCallback(() => {
    if (!enabledRef.current) {
      return;
    }
    const { offsetY, height } = viewportRef.current;
    if (height <= 0) {
      return;
    }
    for (const [storyId, frame] of framesRef.current) {
      const ratio = storyVisibleRatio(frame.y, frame.height, offsetY, height);
      if (ratio < STORY_IMPRESSION_MIN_RATIO) {
        clearTimer(storyId);
        impressedRef.current.delete(storyId);
        continue;
      }
      if (impressedRef.current.has(storyId) || timersRef.current.has(storyId)) {
        continue;
      }
      const timer = setTimeout(() => {
        timersRef.current.delete(storyId);
        const latest = framesRef.current.get(storyId);
        const viewport = viewportRef.current;
        if (!latest || !enabledRef.current) {
          return;
        }
        const stillVisible = storyVisibleRatio(latest.y, latest.height, viewport.offsetY, viewport.height);
        if (stillVisible < STORY_IMPRESSION_MIN_RATIO) {
          return;
        }
        impressedRef.current.add(storyId);
        enqueueStoryFeedEvent({ storyId, type: 'impression' });
      }, STORY_IMPRESSION_MIN_VISIBLE_MS);
      timersRef.current.set(storyId, timer);
    }
  }, [clearTimer]);

  const setMasonryOffset = useCallback(
    (y: number) => {
      masonryOffsetRef.current = y;
      framesRef.current.clear();
      for (const [storyId, frame] of localFramesRef.current) {
        framesRef.current.set(storyId, { y: y + frame.y, height: frame.height });
      }
      evaluate();
    },
    [evaluate],
  );

  const setCardFrame = useCallback(
    (storyId: string, y: number, height: number) => {
      localFramesRef.current.set(storyId, { y, height });
      framesRef.current.set(storyId, { y: masonryOffsetRef.current + y, height });
      evaluate();
    },
    [evaluate],
  );

  const updateViewport = useCallback(
    (offsetY: number, height: number) => {
      viewportRef.current = { offsetY, height };
      evaluate();
    },
    [evaluate],
  );

  const setViewportHeight = useCallback(
    (height: number) => {
      updateViewport(viewportRef.current.offsetY, height);
    },
    [updateViewport],
  );

  useEffect(() => {
    const alive = new Set(storyIds);
    for (const storyId of localFramesRef.current.keys()) {
      if (alive.has(storyId)) {
        continue;
      }
      localFramesRef.current.delete(storyId);
      framesRef.current.delete(storyId);
      clearTimer(storyId);
      impressedRef.current.delete(storyId);
    }
  }, [clearTimer, storyIds]);

  useEffect(() => {
    if (enabled) {
      evaluate();
      return;
    }
    for (const storyId of [...timersRef.current.keys()]) {
      clearTimer(storyId);
    }
  }, [clearTimer, enabled, evaluate]);

  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      for (const timer of timers.values()) {
        clearTimeout(timer);
      }
      timers.clear();
    };
  }, []);

  return { setMasonryOffset, setCardFrame, updateViewport, setViewportHeight };
}
