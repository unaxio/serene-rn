import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

import { toggleSquareAction } from '@/src/features/square/api';
import { SQUARE_QUERY_KEYS } from '@/src/features/square/constants';
import type {
  SquareActionPayload,
  Story,
  ToggleActionResponse,
} from '@/src/features/square/types';
import { useRequireAuth } from '@/src/features/square/hooks/useRequireAuth';

function patchStory(story: Story, result: ToggleActionResponse): Story {
  return {
    ...story,
    resonateCount: result.resonateCount ?? story.resonateCount,
    isResonated: result.isResonated ?? story.isResonated,
    collectCount: result.collectCount ?? story.collectCount,
    isCollected: result.isCollected ?? story.isCollected,
    flowerCount: result.flowerCount ?? story.flowerCount,
    isFlowered: result.isFlowered ?? story.isFlowered,
  };
}

export function useSquareAction() {
  const requireAuth = useRequireAuth();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (payload: SquareActionPayload) => toggleSquareAction(payload),
  });

  const runAction = useCallback(
    async (payload: SquareActionPayload): Promise<ToggleActionResponse | null> => {
      if (!requireAuth()) {
        return null;
      }
      try {
        const result = await mutation.mutateAsync(payload);
        if (payload.targetType === 'story') {
          queryClient.setQueryData(
            SQUARE_QUERY_KEYS.storyDetail(payload.targetId),
            (old: Story | undefined) => (old ? patchStory(old, result) : old),
          );
          await queryClient.invalidateQueries({ queryKey: ['square', 'stories'] });
        }
        if (payload.targetType === 'comment') {
          await queryClient.invalidateQueries({ queryKey: ['square', 'comments'] });
          await queryClient.invalidateQueries({ queryKey: ['square', 'commentReplies'] });
        }
        if (payload.actionType === 'flower') {
          await queryClient.invalidateQueries({
            queryKey: SQUARE_QUERY_KEYS.giftFlowerInventory,
          });
        }
        return result;
      } catch {
        return null;
      }
    },
    [mutation, queryClient, requireAuth],
  );

  return {
    runAction,
    isPending: mutation.isPending,
  };
}
