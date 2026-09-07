import { useInfiniteQuery } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';

import { SEARCH_PAGE_SIZE, SQUARE_QUERY_KEYS } from '@/src/features/square/constants';
import { getSquareSearch } from '@/src/features/square/searchApi';
import type { SquareSearchPage } from '@/src/features/square/types';

function getNextEndCursor(lastPage: SquareSearchPage): string | undefined {
  if (lastPage.items.length < lastPage.size) {
    return undefined;
  }
  const lastCreatedAt = lastPage.items[lastPage.items.length - 1]?.createdAt;
  return lastCreatedAt && lastCreatedAt.length > 0 ? lastCreatedAt : undefined;
}

export function useSquareSearch(keyword: string) {
  const trimmed = keyword.trim();
  const query = useInfiniteQuery({
    queryKey: SQUARE_QUERY_KEYS.search(trimmed),
    queryFn: ({ pageParam }) =>
      getSquareSearch({
        keyword: trimmed,
        size: SEARCH_PAGE_SIZE,
        end: pageParam,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: getNextEndCursor,
    enabled: trimmed.length > 0,
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
    isIdle: trimmed.length === 0,
    isLoading: query.isLoading,
    isError: query.isError,
    isRefreshing: query.isRefetching && !query.isFetchingNextPage,
    isFetchingMore: query.isFetchingNextPage,
    loadMore,
    refresh: query.refetch,
  };
}
