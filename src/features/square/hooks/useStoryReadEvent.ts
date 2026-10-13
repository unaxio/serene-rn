import { useEffect } from 'react';

import {
  enqueueStoryFeedEvent,
  flushStoryFeedEvents,
} from '@/src/features/square/utils/storyFeedEvents';

export function useStoryReadEvent(storyId: string, enabled: boolean): void {
  useEffect(() => {
    if (!enabled || storyId.length === 0) {
      return;
    }
    const startedAt = Date.now();
    return () => {
      enqueueStoryFeedEvent({
        storyId,
        type: 'read',
        dwellMs: Date.now() - startedAt,
      });
      void flushStoryFeedEvents();
    };
  }, [enabled, storyId]);
}
