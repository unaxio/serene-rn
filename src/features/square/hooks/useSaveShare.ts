import { useMutation, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { useCallback } from 'react';

import { EDIT_SUCCESS_MESSAGE, SQUARE_QUERY_KEYS } from '@/src/features/square/constants';
import { useRequireAuth } from '@/src/features/square/hooks/useRequireAuth';
import { createShare, updateShare } from '@/src/features/square/shareApi';
import type { CreateSharePayload, Share } from '@/src/features/square/types';
import { showErrorToast, showToast } from '@/src/utils/toast';

export function useSaveShare(editId?: string | null) {
  const requireAuth = useRequireAuth();
  const queryClient = useQueryClient();
  const isEdit = Boolean(editId);

  const mutation = useMutation({
    mutationFn: (payload: CreateSharePayload) =>
      isEdit && editId ? updateShare(editId, payload) : createShare(payload),
  });

  const submit = useCallback(
    async (payload: CreateSharePayload): Promise<Share | null> => {
      if (!requireAuth()) {
        return null;
      }
      try {
        const share = await mutation.mutateAsync(payload);
        if (share.id) {
          queryClient.setQueryData(SQUARE_QUERY_KEYS.shareDetail(share.id), share);
        }
        await queryClient.invalidateQueries({ queryKey: SQUARE_QUERY_KEYS.shares });
        if (isEdit) {
          showToast(EDIT_SUCCESS_MESSAGE);
        }
        return share;
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
