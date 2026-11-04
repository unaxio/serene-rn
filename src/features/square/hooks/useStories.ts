import { type InfiniteData, useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { AppState } from 'react-native';

import { getStoryFeed } from '@/src/features/square/api';
import {
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

function getNextPageParam(
  lastPage: SquarePagedData<Story>,
  _allPages: SquarePagedData<Story>[],
  lastPageParam: number,
): number | undefined {
  if (lastPage.items.length === 0) {
    return undefined;
  }
  return lastPageParam + 1;
}

export function useStories(category: string) {
  const queryClient = useQueryClient();
  const queryKey = SQUARE_QUERY_KEYS.stories(category);
  const refreshingRef = useRef(false);
  const lastFailedAtRef = useRef(0);
  const feedHoldRef = useRef(false);

  const query = useInfiniteQuery({
    queryKey,
    queryFn: async ({ pageParam }) => {
      const before = queryClient.getQueryData<InfiniteData<SquarePagedData<Story>>>(queryKey);
      const knownIds = new Set(flattenStoryFeedPages(before?.pages).map((item) => item.id));
      const page = await getStoryFeed(category);
      const newCount = page.items.filter((item) => item.id.length > 0 && !knownIds.has(item.id)).length;
      if (pageParam === 1) {
        feedHoldRef.current = false;
        markStoryFeedWindow(category);
      } else if (page.items.length > 0 && newCount === 0) {
        feedHoldRef.current = true;
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
      feedHoldRef.current = false;
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

  const releaseFeedHold = useCallback(() => {
    feedHoldRef.current = false;
  }, []);

  const loadMore = useCallback(() => {
    if (feedHoldRef.current) {
      return;
    }
    if (isStoryFeedWindowExpired(category)) {
      void refreshRef.current();
      return;
    }
    if (query.hasNextPage && !query.isFetchingNextPage && !query.isRefetching) {
      void query.fetchNextPage();
    }
  }, [category, query]);

  useEffect(() => {
    feedHoldRef.current = false;
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
    releaseFeedHold,
    refresh,
    refetch: query.refetch,
  };
}
