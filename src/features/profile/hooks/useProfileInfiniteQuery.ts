import { useInfiniteQuery } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';

import { PROFILE_PAGE_SIZE } from '@/src/features/profile/constants';
import type { SquarePagedData } from '@/src/features/square/types';

function getNextPageParam<T>(lastPage: SquarePagedData<T>): number | undefined {
  const loaded = lastPage.page * lastPage.pageSize;
  return loaded < lastPage.total ? lastPage.page + 1 : undefined;
}

export function useProfileInfiniteQuery<T>(
  queryKey: readonly unknown[],
  fetchPage: (page: number, pageSize: number) => Promise<SquarePagedData<T>>,
  enabled = true,
) {
  const query = useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam }) => fetchPage(pageParam, PROFILE_PAGE_SIZE),
    initialPageParam: 1,
    getNextPageParam,
    enabled,
  });

  const items = useMemo(
    () => query.data?.pages.flatMap((page) => page.items) ?? [],
    [query.data?.pages],
  );

  const loadMore = useCallback(() => {
    if (query.hasNextPage && !query.isFetchingNextPage) {
      void query.fetchNextPage();
    }
  }, [query]);

  return {
    items,
    isLoading: query.isLoading,
    isError: query.isError,
    isRefreshing: query.isRefetching && !query.isFetchingNextPage,
    isFetchingMore: query.isFetchingNextPage,
    hasNextPage: query.hasNextPage,
    loadMore,
    refresh: query.refetch,
    refetch: query.refetch,
  };
}
