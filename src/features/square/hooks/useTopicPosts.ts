import { useInfiniteQuery } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';

import {
  SEARCH_PAGE_SIZE,
  SQUARE_QUERY_KEYS,
  TOPIC_NAME_MAX_LENGTH,
} from '@/src/features/square/constants';
import { getTopicPosts } from '@/src/features/square/topicApi';
import type { SquareSearchPage } from '@/src/features/square/types';

function getNextPage(lastPage: SquareSearchPage): number | undefined {
  if (lastPage.page * lastPage.pageSize < lastPage.total) {
    return lastPage.page + 1;
  }
  return undefined;
}

export function useTopicPosts(name: string) {
  const trimmed = name.trim();
  const enabled = trimmed.length > 0 && trimmed.length <= TOPIC_NAME_MAX_LENGTH;
  const query = useInfiniteQuery({
    queryKey: SQUARE_QUERY_KEYS.topicPosts(trimmed),
    queryFn: ({ pageParam }) =>
      getTopicPosts({
        name: trimmed,
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
    isLoading: query.isLoading,
    isError: query.isError,
    isRefreshing: query.isRefetching && !query.isFetchingNextPage,
    isFetchingMore: query.isFetchingNextPage,
    loadMore,
    refresh: query.refetch,
  };
}
