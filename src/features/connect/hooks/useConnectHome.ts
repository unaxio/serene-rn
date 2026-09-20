import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';

import { getConnectHome } from '@/src/features/connect/api';
import { CONNECT_PAGE_SIZE, CONNECT_QUERY_KEYS } from '@/src/features/connect/constants';
import type { ConnectConversation, ConnectUnreadCounts } from '@/src/features/connect/types';
import { useAuthStore } from '@/src/store/authStore';

export function useConnectHome() {
  const isAuthenticated = useAuthStore((state) => state.status === 'authenticated');
  const queryClient = useQueryClient();
  const query = useInfiniteQuery({
    queryKey: CONNECT_QUERY_KEYS.home,
    queryFn: ({ pageParam }) => getConnectHome(pageParam, CONNECT_PAGE_SIZE),
    initialPageParam: 1,
    enabled: isAuthenticated,
    getNextPageParam: (lastPage) => {
      const page = lastPage.conversations;
      return page.page * page.pageSize < page.total ? page.page + 1 : undefined;
    },
  });

  const conversations = useMemo(
    () => query.data?.pages.flatMap((page) => page.conversations.items) ?? [],
    [query.data?.pages],
  );
  const unread: ConnectUnreadCounts | undefined = query.data?.pages[0]?.unread;

  const refresh = useCallback(async () => {
    await Promise.all([
      query.refetch(),
      queryClient.invalidateQueries({ queryKey: CONNECT_QUERY_KEYS.unread }),
    ]);
  }, [query, queryClient]);

  const loadMore = useCallback(() => {
    if (query.hasNextPage && !query.isFetchingNextPage) {
      void query.fetchNextPage();
    }
  }, [query]);

  return {
    conversations,
    unread,
    isLoading: query.isLoading,
    isError: query.isError,
    isRefreshing: query.isRefetching && !query.isFetchingNextPage,
    refresh,
    loadMore,
  };
}

export type ConnectHomeConversation = ConnectConversation;
