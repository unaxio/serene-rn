import { useInfiniteQuery } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';

import {
  SEARCH_KEYWORD_MAX_LENGTH,
  SEARCH_PAGE_SIZE,
  SQUARE_QUERY_KEYS,
} from '@/src/features/square/constants';
import { getSquareSearch } from '@/src/features/square/searchApi';
import type { SquareSearchPage } from '@/src/features/square/types';

function getNextPage(lastPage: SquareSearchPage): number | undefined {
  // 某页内容被删后 items 会短于 pageSize，是否还有下一页只看 total。
  if (lastPage.page * lastPage.pageSize < lastPage.total) {
    return lastPage.page + 1;
  }
  return undefined;
}

export function useSquareSearch(keyword: string) {
  const trimmed = keyword.trim();
  const enabled = trimmed.length > 0 && trimmed.length <= SEARCH_KEYWORD_MAX_LENGTH;
  const query = useInfiniteQuery({
    queryKey: SQUARE_QUERY_KEYS.search(trimmed),
    queryFn: ({ pageParam }) =>
      getSquareSearch({
        keyword: trimmed,
        page: pageParam,
        pageSize: SEARCH_PAGE_SIZE,
      }),
    initialPageParam: 1,
    getNextPageParam: getNextPage,
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
    isIdle: trimmed.length === 0,
    isLoading: query.isLoading,
    isError: query.isError,
    isRefreshing: query.isRefetching && !query.isFetchingNextPage,
    isFetchingMore: query.isFetchingNextPage,
    loadMore,
    refresh: query.refetch,
  };
}
