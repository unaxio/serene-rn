import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

import { SQUARE_QUERY_KEYS } from '@/src/features/square/constants';
import { purchaseGiftFlower } from '@/src/features/square/giftFlowerApi';
import { useRequireAuth } from '@/src/features/square/hooks/useRequireAuth';
import type { PurchaseGiftFlowerResponse } from '@/src/features/square/types';
import { toastCaughtFailure } from '@/src/utils/requestError';

export function usePurchaseGiftFlower() {
  const requireAuth = useRequireAuth();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: purchaseGiftFlower,
  });

  const purchase = useCallback(
    async (
      giftFlowerId: string,
      quantity: number,
    ): Promise<PurchaseGiftFlowerResponse | null> => {
      if (!requireAuth()) {
        return null;
      }
      try {
        const result = await mutation.mutateAsync({ giftFlowerId, quantity });
        await queryClient.invalidateQueries({
          queryKey: SQUARE_QUERY_KEYS.giftFlowerInventory,
        });
        return result;
      } catch (error) {
        toastCaughtFailure(error);
        return null;
      }
    },
    [mutation, queryClient, requireAuth],
  );

  return {
    purchase,
    isPending: mutation.isPending,
  };
}
