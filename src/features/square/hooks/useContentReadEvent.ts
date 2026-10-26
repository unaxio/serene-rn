import { useEffect } from 'react';

import type { ContentEventTargetType } from '@/src/features/square/types';
import {
  enqueueContentEvent,
  flushContentEvents,
} from '@/src/features/square/utils/contentEvents';

export function useContentReadEvent(
  targetType: ContentEventTargetType,
  targetId: string,
  enabled: boolean,
): void {
  useEffect(() => {
    if (!enabled || targetId.length === 0) {
      return;
    }
    const startedAt = Date.now();
    return () => {
      enqueueContentEvent({
        targetType,
        targetId,
        type: 'read',
        dwellMs: Date.now() - startedAt,
      });
      void flushContentEvents();
    };
  }, [enabled, targetId, targetType]);
}
