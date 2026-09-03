import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

import { toggleSquareAction } from '@/src/features/square/api';
import { SQUARE_QUERY_KEYS } from '@/src/features/square/constants';
import { useRequireAuth } from '@/src/features/square/hooks/useRequireAuth';
import type {
  Ask,
  AskAnswer,
  Share,
  SquareActionPayload,
  SquarePagedData,
  Story,
  ToggleActionResponse,
} from '@/src/features/square/types';
import {
  patchAsk,
  patchAskAnswer,
  patchPagedItems,
  patchShare,
  patchStory,
} from '@/src/features/square/utils/patchActionTarget';

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
        if (payload.targetType === 'share') {
          queryClient.setQueriesData(
            { queryKey: SQUARE_QUERY_KEYS.shares },
            (old: { pages: SquarePagedData<Share>[]; pageParams: unknown[] } | undefined) =>
              patchPagedItems(old, payload.targetId, (item) => patchShare(item, result)),
          );
        }
        if (payload.targetType === 'ask') {
          queryClient.setQueryData(
            SQUARE_QUERY_KEYS.askDetail(payload.targetId),
            (old: Ask | undefined) => (old ? patchAsk(old, result) : old),
          );
          queryClient.setQueriesData(
            { queryKey: SQUARE_QUERY_KEYS.asks },
            (old: { pages: SquarePagedData<Ask>[]; pageParams: unknown[] } | undefined) =>
              patchPagedItems(old, payload.targetId, (item) => patchAsk(item, result)),
          );
        }
        if (payload.targetType === 'ask_answer') {
          queryClient.setQueriesData(
            { queryKey: ['square', 'askAnswers'] },
            (old: { pages: SquarePagedData<AskAnswer>[]; pageParams: unknown[] } | undefined) =>
              patchPagedItems(old, payload.targetId, (item) => patchAskAnswer(item, result)),
          );
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
