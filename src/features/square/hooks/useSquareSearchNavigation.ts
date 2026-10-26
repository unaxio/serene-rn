import { useRouter } from 'expo-router';
import { useCallback } from 'react';

import { isUnavailableContent, probeSearchHotTarget } from '@/src/features/square/searchApi';
import type { SquareSearchItem } from '@/src/features/square/types';
import { armCommentFocus } from '@/src/features/square/utils/commentFocusCue';
import { CONTENT_UNAVAILABLE_MESSAGE } from '@/src/features/square/utils/contentAnchor';
import { enqueueContentEvent } from '@/src/features/square/utils/contentEvents';
import { toastCaughtFailure } from '@/src/utils/requestError';
import { showToast } from '@/src/utils/toast';

export function useSquareSearchNavigation(removeHot: (kind: 'story' | 'ask', id: string) => void) {
  const router = useRouter();

  const openHot = useCallback(
    async (kind: 'story' | 'ask', id: string) => {
      try {
        await probeSearchHotTarget(kind, id);
        router.push(kind === 'story' ? `/stories/${id}` : `/asks/${id}`);
      } catch (error) {
        if (isUnavailableContent(error)) {
          showToast(CONTENT_UNAVAILABLE_MESSAGE);
          removeHot(kind, id);
          return;
        }
        toastCaughtFailure(error);
      }
    },
    [removeHot, router],
  );

  const handlePressItem = useCallback(
    (item: SquareSearchItem) => {
      if (item.type === 'story') {
        if (item.commentId) {
          armCommentFocus({ highlightId: item.commentId });
        }
        router.push(`/stories/${item.id}`);
        return;
      }
      if (item.type === 'share') {
        enqueueContentEvent({ targetType: 'share', targetId: item.id, type: 'click' });
        router.push(`/shares/${item.id}`);
        return;
      }
      if (item.type === 'ask_answer') {
        const askId = item.askId?.trim() ?? '';
        if (askId.length === 0) {
          return;
        }
        enqueueContentEvent({ targetType: 'ask_answer', targetId: item.id, type: 'click' });
        router.push(`/asks/${askId}`);
        return;
      }
      router.push(`/asks/${item.id}`);
    },
    [router],
  );

  return { openHot, handlePressItem };
}
