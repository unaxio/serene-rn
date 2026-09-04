import { useInfiniteQuery } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';

import {
  FLOWER_LEDGER_PAGE_SIZE,
  SQUARE_QUERY_KEYS,
} from '@/src/features/square/constants';
import { getGiftFlowerLedgers } from '@/src/features/square/giftFlowerLedgerApi';
import type { GiftFlowerLedgerTargetType } from '@/src/features/square/types';

interface UseGiftFlowerLedgersParams {
  targetType: GiftFlowerLedgerTargetType;
  targetId: string;
  enabled?: boolean;
}

function getNextPageParam(lastPage: {
  page: number;
  pageSize: number;
  total: number;
}): number | undefined {
  const loaded = lastPage.page * lastPage.pageSize;
  return loaded < lastPage.total ? lastPage.page + 1 : undefined;
}

export function useGiftFlowerLedgers({
  targetType,
  targetId,
  enabled = true,
}: UseGiftFlowerLedgersParams) {
  const query = useInfiniteQuery({
    queryKey: SQUARE_QUERY_KEYS.giftFlowerLedgers(targetType, targetId),
    queryFn: ({ pageParam }) =>
      getGiftFlowerLedgers({
        targetType,
        targetId,
        page: pageParam,
        pageSize: FLOWER_LEDGER_PAGE_SIZE,
      }),
    initialPageParam: 1,
    getNextPageParam,
    enabled: enabled && targetId.length > 0,
  });

  const items = useMemo(
    () =>
      (query.data?.pages.flatMap((page) => page.items) ?? []).filter(
        (item) => item.id.length > 0,
      ),
    [query.data?.pages],
  );

  const loadMore = useCallback(() => {
    if (query.hasNextPage && !query.isFetchingNextPage) {
      void query.fetchNextPage();
    }
  }, [query]);

  return {
    items,
    total: query.data?.pages[0]?.total ?? 0,
    isLoading: query.isLoading,
    isError: query.isError,
    isFetchingNextPage: query.isFetchingNextPage,
    hasNextPage: Boolean(query.hasNextPage),
    loadMore,
    refresh: query.refetch,
  };
}
