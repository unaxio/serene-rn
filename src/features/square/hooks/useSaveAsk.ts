import { useMutation, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { useCallback } from 'react';

import { createAsk, updateAsk } from '@/src/features/square/askApi';
import { EDIT_SUCCESS_MESSAGE, SQUARE_QUERY_KEYS } from '@/src/features/square/constants';
import { useRequireAuth } from '@/src/features/square/hooks/useRequireAuth';
import type { Ask, CreateAskPayload } from '@/src/features/square/types';
import { showErrorToast, showToast } from '@/src/utils/toast';

export function useSaveAsk(editId?: string | null) {
  const requireAuth = useRequireAuth();
  const queryClient = useQueryClient();
  const isEdit = Boolean(editId);

  const mutation = useMutation({
    mutationFn: (payload: CreateAskPayload) =>
      isEdit && editId ? updateAsk(editId, payload) : createAsk(payload),
  });

  const submit = useCallback(
    async (payload: CreateAskPayload): Promise<Ask | null> => {
      if (!requireAuth()) {
        return null;
      }
      try {
        const ask = await mutation.mutateAsync(payload);
        if (ask.id) {
          queryClient.setQueryData(SQUARE_QUERY_KEYS.askDetail(ask.id), ask);
        }
        await queryClient.invalidateQueries({ queryKey: SQUARE_QUERY_KEYS.asks });
        if (isEdit) {
          showToast(EDIT_SUCCESS_MESSAGE);
        }
        return ask;
      } catch (error) {
        if (!isAxiosError(error)) {
          const message = error instanceof Error ? error.message : '保存失败，请稍后重试';
          showErrorToast(message);
        }
        return null;
      }
    },
    [editId, isEdit, mutation, queryClient, requireAuth],
  );

  return {
    submit,
    isSubmitting: mutation.isPending,
    isEdit,
  };
}
