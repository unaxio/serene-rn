import { useQuery, useQueryClient } from '@tanstack/react-query';

import { SQUARE_QUERY_KEYS } from '@/src/features/square/constants';
import { getShareDetail } from '@/src/features/square/shareApi';
import type { Share } from '@/src/features/square/types';

export function useShareDetail(shareId: string) {
  const queryClient = useQueryClient();
  const cached = queryClient.getQueryData<Share>(SQUARE_QUERY_KEYS.shareDetail(shareId));

  const query = useQuery({
    queryKey: SQUARE_QUERY_KEYS.shareDetail(shareId),
    queryFn: () => getShareDetail(shareId),
    enabled: shareId.length > 0,
    initialData: cached,
    // 列表编辑会先写入缓存；详情 GET 若暂未提供时仍可用缓存预填
    retry: cached ? false : 1,
  });

  return {
    share: query.data ?? cached,
    isLoading: query.isLoading,
    isError: query.isError && !cached,
    refetch: query.refetch,
  };
}
