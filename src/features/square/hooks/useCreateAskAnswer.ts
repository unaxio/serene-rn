import { useMutation, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { useCallback } from 'react';

import { createAskAnswer } from '@/src/features/square/askApi';
import { SQUARE_QUERY_KEYS } from '@/src/features/square/constants';
import { useRequireAuth } from '@/src/features/square/hooks/useRequireAuth';
import type { AskAnswer, CreateAskAnswerPayload } from '@/src/features/square/types';
import { showErrorToast } from '@/src/utils/toast';

export function useCreateAskAnswer(askId: string) {
  const requireAuth = useRequireAuth();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (payload: CreateAskAnswerPayload) => createAskAnswer(askId, payload),
  });

  const submit = useCallback(
    async (payload: CreateAskAnswerPayload): Promise<AskAnswer | null> => {
      if (!requireAuth()) {
        return null;
      }
      try {
        const answer = await mutation.mutateAsync(payload);
        await queryClient.invalidateQueries({ queryKey: SQUARE_QUERY_KEYS.askDetail(askId) });
        await queryClient.invalidateQueries({ queryKey: ['square', 'askAnswers', askId] });
        await queryClient.invalidateQueries({ queryKey: SQUARE_QUERY_KEYS.asks });
        return answer;
      } catch (error) {
        if (!isAxiosError(error)) {
          const message = error instanceof Error ? error.message : '提交失败，请稍后重试';
          showErrorToast(message);
        }
        return null;
      }
    },
    [askId, mutation, queryClient, requireAuth],
  );

  return {
    submit,
    isSubmitting: mutation.isPending,
  };
}
