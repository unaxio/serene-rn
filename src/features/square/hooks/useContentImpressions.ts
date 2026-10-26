import type { ViewToken } from '@shopify/flash-list';
import { useEffect, useRef } from 'react';

import {
  STORY_IMPRESSION_MIN_RATIO,
  STORY_IMPRESSION_MIN_VISIBLE_MS,
} from '@/src/features/square/constants';
import type { ContentEventTargetType } from '@/src/features/square/types';
import { enqueueContentEvent } from '@/src/features/square/utils/contentEvents';

export interface ContentImpressionTarget {
  targetType: ContentEventTargetType;
  targetId: string;
}

const VISIBLE_PERCENT = STORY_IMPRESSION_MIN_RATIO * 100;

function targetKey(target: ContentImpressionTarget): string {
  return `${target.targetType}:${target.targetId}`;
}

export function useContentImpressions<T>(
  items: readonly T[],
  resolveTarget: (item: T) => ContentImpressionTarget | null,
) {
  const resolveRef = useRef(resolveTarget);
  resolveRef.current = resolveTarget;
  const seenRef = useRef(new Set<string>());

  useEffect(() => {
    const alive = new Set<string>();
    for (const item of items) {
      const target = resolveRef.current(item);
      if (target && target.targetId.length > 0) {
        alive.add(targetKey(target));
      }
    }
    for (const key of seenRef.current) {
      if (!alive.has(key)) {
        seenRef.current.delete(key);
      }
    }
  }, [items]);

  const onViewableItemsChanged = useRef(
    (info: { viewableItems: ViewToken<T>[]; changed: ViewToken<T>[] }) => {
      for (const token of info.changed) {
        const target = resolveRef.current(token.item);
        if (!target || target.targetId.length === 0) {
          continue;
        }
        const key = targetKey(target);
        if (!token.isViewable) {
          seenRef.current.delete(key);
          continue;
        }
        if (seenRef.current.has(key)) {
          continue;
        }
        seenRef.current.add(key);
        enqueueContentEvent({
          targetType: target.targetType,
          targetId: target.targetId,
          type: 'impression',
        });
      }
    },
  ).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: VISIBLE_PERCENT,
    minimumViewTime: STORY_IMPRESSION_MIN_VISIBLE_MS,
  }).current;

  return { onViewableItemsChanged, viewabilityConfig };
}
