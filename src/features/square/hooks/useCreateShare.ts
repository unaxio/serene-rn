import { useMutation, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { useCallback } from 'react';

import { SQUARE_QUERY_KEYS } from '@/src/features/square/constants';
import { createShare } from '@/src/features/square/shareApi';
import { useRequireAuth } from '@/src/features/square/hooks/useRequireAuth';
import type { CreateSharePayload, Share } from '@/src/features/square/types';
import { showErrorToast } from '@/src/utils/toast';

export function useCreateShare() {
  const requireAuth = useRequireAuth();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (payload: CreateSharePayload) => createShare(payload),
  });

  const submit = useCallback(
    async (payload: CreateSharePayload): Promise<Share | null> => {
      if (!requireAuth()) {
        return null;
      }
      try {
        const share = await mutation.mutateAsync(payload);
        await queryClient.invalidateQueries({ queryKey: SQUARE_QUERY_KEYS.shares });
        return share;
      } catch (error) {
        if (!isAxiosError(error)) {
          const message = error instanceof Error ? error.message : '发布失败，请稍后重试';
          showErrorToast(message);
        }
        return null;
      }
    },
    [mutation, queryClient, requireAuth],
  );

  return {
    submit,
    isSubmitting: mutation.isPending,
  };
}
