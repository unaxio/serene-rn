import { useInfiniteQuery } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';

import { getAskAnswers } from '@/src/features/square/askApi';
import { SQUARE_PAGE_SIZE, SQUARE_QUERY_KEYS } from '@/src/features/square/constants';
import type { AskAnswerSort } from '@/src/features/square/types';

function getNextPageParam(lastPage: {
  page: number;
  pageSize: number;
  total: number;
}): number | undefined {
  const loaded = lastPage.page * lastPage.pageSize;
  return loaded < lastPage.total ? lastPage.page + 1 : undefined;
}

export function useAskAnswers(askId: string, sort: AskAnswerSort) {
  const query = useInfiniteQuery({
    queryKey: SQUARE_QUERY_KEYS.askAnswers(askId, sort),
    queryFn: ({ pageParam }) =>
      getAskAnswers({
        askId,
        sort,
        page: pageParam,
        pageSize: SQUARE_PAGE_SIZE,
      }),
    initialPageParam: 1,
    getNextPageParam,
    enabled: askId.length > 0,
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
    isLoading: query.isLoading,
    isError: query.isError,
    isRefreshing: query.isRefetching && !query.isFetchingNextPage,
    isFetchingMore: query.isFetchingNextPage,
    loadMore,
    refresh: query.refetch,
  };
}
