import { useInfiniteQuery } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';

import { getStories } from '@/src/features/square/api';
import { SQUARE_PAGE_SIZE, SQUARE_QUERY_KEYS } from '@/src/features/square/constants';

function getNextPageParam(lastPage: {
  page: number;
  pageSize: number;
  total: number;
}): number | undefined {
  const loaded = lastPage.page * lastPage.pageSize;
  return loaded < lastPage.total ? lastPage.page + 1 : undefined;
}

export function useStories(category: string) {
  const query = useInfiniteQuery({
    queryKey: SQUARE_QUERY_KEYS.stories(category),
    queryFn: ({ pageParam }) =>
      getStories({
        category,
        page: pageParam,
        pageSize: SQUARE_PAGE_SIZE,
      }),
    initialPageParam: 1,
    getNextPageParam,
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

  const refresh = useCallback(async () => {
    await query.refetch();
  }, [query]);

  return {
    items,
    isLoading: query.isLoading,
    isError: query.isError,
    isRefreshing: query.isRefetching && !query.isFetchingNextPage,
    isFetchingMore: query.isFetchingNextPage,
    hasNextPage: query.hasNextPage,
    loadMore,
    refresh,
    refetch: query.refetch,
  };
}
