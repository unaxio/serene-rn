import { useInfiniteQuery } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';

import {
  FLOWER_LEDGER_PAGE_SIZE,
  SQUARE_QUERY_KEYS,
} from '@/src/features/square/constants';
import { getGiftFlowerLedgers } from '@/src/features/square/giftFlowerLedgerApi';
import type {
  GiftFlowerLedger,
  GiftFlowerLedgerTargetType,
  SquarePagedData,
} from '@/src/features/square/types';

interface UseGiftFlowerLedgersParams {
  targetType: GiftFlowerLedgerTargetType;
  targetId: string;
  enabled?: boolean;
}

function getNextPageParam(
  lastPage: SquarePagedData<GiftFlowerLedger>,
  allPages: SquarePagedData<GiftFlowerLedger>[],
  lastPageParam: number,
): number | undefined {
  if (lastPage.items.length === 0 || lastPage.items.length < lastPage.pageSize) {
    return undefined;
  }
  const nextPage = lastPage.page + 1;
  if (nextPage <= lastPageParam) {
    return undefined;
  }
  const loadedCount = allPages.reduce((sum, page) => sum + page.items.length, 0);
  if (loadedCount >= lastPage.total) {
    return undefined;
  }
  const totalPages = Math.ceil(lastPage.total / lastPage.pageSize);
  if (totalPages <= 0 || lastPage.page >= totalPages || nextPage > totalPages) {
    return undefined;
  }
  return nextPage;
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
  }, [query.fetchNextPage, query.hasNextPage, query.isFetchingNextPage]);

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
