import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

import { useLightCard as useLightCardApi } from '@/src/features/soulFlower/api';
import { SOUL_FLOWER_QUERY_KEYS } from '@/src/features/soulFlower/constants';
import { toCompactDateKey } from '@/src/features/soulFlower/utils/checkInCalendar';
import { showErrorToast, showToast } from '@/src/utils/toast';

export function useUseLightCard() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (normalizedDateKey: string) =>
      useLightCardApi(toCompactDateKey(normalizedDateKey)),
  });

  const useForDate = useCallback(
    async (normalizedDateKey: string) => {
      try {
        const result = await mutation.mutateAsync(normalizedDateKey);
        if (result.success === false) {
          showErrorToast(result.message ?? '使用续光卡失败');
          return false;
        }
        showToast(result.message ?? '补签成功');
        await Promise.all([
          queryClient.refetchQueries({
            queryKey: SOUL_FLOWER_QUERY_KEYS.checkInRecords,
          }),
          queryClient.refetchQueries({
            queryKey: SOUL_FLOWER_QUERY_KEYS.mindMap,
          }),
          queryClient.refetchQueries({
            queryKey: SOUL_FLOWER_QUERY_KEYS.partnerStatus,
          }),
        ]);
        return true;
      } catch {
        return false;
      }
    },
    [mutation, queryClient],
  );

  return {
    useForDate,
    isPending: mutation.isPending,
  };
}
