import { useInfiniteQuery } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';

import { getConnectNotifications } from '@/src/features/connect/api';
import { CONNECT_PAGE_SIZE, CONNECT_QUERY_KEYS } from '@/src/features/connect/constants';
import type {
  ConnectNotification,
  ConnectNotificationCategory,
} from '@/src/features/connect/types';
import { useAuthStore } from '@/src/store/authStore';

export function useConnectNotifications(category: ConnectNotificationCategory) {
  const isAuthenticated = useAuthStore((state) => state.status === 'authenticated');
  const query = useInfiniteQuery({
    queryKey: CONNECT_QUERY_KEYS.notifications(category),
    queryFn: ({ pageParam }) => getConnectNotifications(category, pageParam, CONNECT_PAGE_SIZE),
    initialPageParam: 1,
    enabled: isAuthenticated,
    getNextPageParam: (lastPage) =>
      lastPage.page * lastPage.pageSize < lastPage.total ? lastPage.page + 1 : undefined,
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
    refresh: query.refetch,
    loadMore,
  };
}

export type { ConnectNotification };
