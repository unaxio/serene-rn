import { type InfiniteData, useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { AppState } from 'react-native';

import { getStoryFeed } from '@/src/features/square/api';
import {
  SQUARE_PAGE_SIZE,
  SQUARE_QUERY_KEYS,
  STORY_FEED_REFRESH_RETRY_MS,
  STORY_FEED_WINDOW_MS,
} from '@/src/features/square/constants';
import type { SquarePagedData, Story } from '@/src/features/square/types';
import {
  flattenStoryFeedPages,
  isStoryFeedWindowExpired,
  markStoryFeedWindow,
  trimStoryFeedToFirstPage,
} from '@/src/features/square/utils/storyFeedSession';

interface RefreshOptions {
  manual?: boolean;
}

function getNextPageParam(lastPage: {
  page: number;
  pageSize: number;
  total: number;
}): number | undefined {
  const loaded = lastPage.page * lastPage.pageSize;
  return loaded < lastPage.total ? lastPage.page + 1 : undefined;
}

export function useStories(category: string) {
  const queryClient = useQueryClient();
  const queryKey = SQUARE_QUERY_KEYS.stories(category);
  const refreshingRef = useRef(false);
  const lastFailedAtRef = useRef(0);

  const query = useInfiniteQuery({
    queryKey,
    queryFn: async ({ pageParam }) => {
      const page = await getStoryFeed({
        category,
        page: pageParam,
        pageSize: SQUARE_PAGE_SIZE,
      });
      if (pageParam === 1) {
        markStoryFeedWindow(category);
      }
      return page;
    },
    initialPageParam: 1,
    getNextPageParam,
    staleTime: STORY_FEED_WINDOW_MS,
    // 后台把已加载的第 2 页一起重拉会和这次重抽的第 1 页对不齐，只在刷新时主动重拉第 1 页。
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const refresh = useCallback(
    async (options?: RefreshOptions) => {
      if (refreshingRef.current) {
        return;
      }
      const inCooldown = Date.now() - lastFailedAtRef.current < STORY_FEED_REFRESH_RETRY_MS;
      if (!options?.manual && inCooldown) {
        return;
      }
      refreshingRef.current = true;
      const previous = queryClient.getQueryData<InfiniteData<SquarePagedData<Story>>>(queryKey);
      try {
        queryClient.setQueryData<InfiniteData<SquarePagedData<Story>>>(queryKey, (current) =>
          trimStoryFeedToFirstPage(current),
        );
        const result = await query.refetch();
        if (result.isError) {
          lastFailedAtRef.current = Date.now();
          if (previous) {
            queryClient.setQueryData(queryKey, previous);
          }
        }
      } catch {
        lastFailedAtRef.current = Date.now();
        if (previous) {
          queryClient.setQueryData(queryKey, previous);
        }
      } finally {
        refreshingRef.current = false;
      }
    },
    [query, queryClient, queryKey],
  );

  const refreshRef = useRef(refresh);
  refreshRef.current = refresh;

  const loadMore = useCallback(() => {
    if (isStoryFeedWindowExpired(category)) {
      void refreshRef.current();
      return;
    }
    if (query.hasNextPage && !query.isFetchingNextPage && !query.isRefetching) {
      void query.fetchNextPage();
    }
  }, [category, query]);

  useEffect(() => {
    if (isStoryFeedWindowExpired(category)) {
      void refreshRef.current();
    }
  }, [category]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'active' && isStoryFeedWindowExpired(category)) {
        void refreshRef.current();
      }
    });
    return () => subscription.remove();
  }, [category]);

  const items = useMemo(
    () => flattenStoryFeedPages(query.data?.pages),
    [query.data?.pages],
  );

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
