import { useMutation, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { useCallback } from 'react';

import { createAskAnswer, updateAskAnswer } from '@/src/features/square/askApi';
import { EDIT_SUCCESS_MESSAGE, SQUARE_QUERY_KEYS } from '@/src/features/square/constants';
import { useRequireAuth } from '@/src/features/square/hooks/useRequireAuth';
import type { AskAnswer, CreateAskAnswerPayload } from '@/src/features/square/types';
import { showErrorToast, showToast } from '@/src/utils/toast';

export function useSaveAskAnswer(askId: string, editId?: string | null) {
  const requireAuth = useRequireAuth();
  const queryClient = useQueryClient();
  const isEdit = Boolean(editId);

  const mutation = useMutation({
    mutationFn: (payload: CreateAskAnswerPayload) =>
      isEdit && editId
        ? updateAskAnswer(editId, payload)
        : createAskAnswer(askId, payload),
  });

  const submit = useCallback(
    async (payload: CreateAskAnswerPayload): Promise<AskAnswer | null> => {
      if (!requireAuth()) {
        return null;
      }
      try {
        const answer = await mutation.mutateAsync(payload);
        if (answer.id) {
          await queryClient.invalidateQueries({
            queryKey: SQUARE_QUERY_KEYS.askAnswerDetail(answer.id),
          });
        }
        await queryClient.invalidateQueries({ queryKey: SQUARE_QUERY_KEYS.askDetail(askId) });
        await queryClient.invalidateQueries({ queryKey: ['square', 'askAnswers', askId] });
        await queryClient.invalidateQueries({ queryKey: SQUARE_QUERY_KEYS.asks });
        if (isEdit) {
          showToast(EDIT_SUCCESS_MESSAGE);
        }
        return answer;
      } catch (error) {
        if (!isAxiosError(error)) {
          const message = error instanceof Error ? error.message : '保存失败，请稍后重试';
          showErrorToast(message);
        }
        return null;
      }
    },
    [askId, editId, isEdit, mutation, queryClient, requireAuth],
  );

  return {
    submit,
    isSubmitting: mutation.isPending,
    isEdit,
  };
}
