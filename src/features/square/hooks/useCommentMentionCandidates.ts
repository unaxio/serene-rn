import { useInfiniteQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';

import { getFollowingPage, searchUsersPage, type FollowPage } from '@/src/features/follow/api';
import type { FollowUser } from '@/src/features/follow/types';
import {
  COMMENT_MENTION_DEBOUNCE_MS,
  COMMENT_MENTION_PAGE_SIZE,
} from '@/src/features/square/utils/commentMention';
import { useAuthStore } from '@/src/store/authStore';

function nextCandidatePage(last: FollowPage): number | undefined {
  if (last.items.length === 0 || last.items.length > last.pageSize) {
    return undefined;
  }
  if (last.items.length < last.pageSize || last.page * last.pageSize >= last.total) {
    return undefined;
  }
  return last.page + 1;
}

function collectUsers(pages: FollowPage[] | undefined): FollowUser[] {
  const seen = new Set<string>();
  const users: FollowUser[] = [];
  (pages ?? []).forEach((page) => {
    page.items.forEach((user) => {
      if (!user.userId || seen.has(user.userId)) {
        return;
      }
      seen.add(user.userId);
      users.push(user);
    });
  });
  return users;
}

export function useCommentMentionCandidates(query: string | null) {
  const isAuthenticated = useAuthStore((state) => state.status === 'authenticated');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    if (query === null) {
      return;
    }
    const delay = query.length === 0 ? 0 : COMMENT_MENTION_DEBOUNCE_MS;
    const timer = setTimeout(() => setDebouncedQuery(query), delay);
    return () => clearTimeout(timer);
  }, [query]);

  const showSearch = query !== null && query.length > 0 && debouncedQuery === query;
  const followingQuery = useInfiniteQuery({
    queryKey: ['follow', 'following', 'mention', COMMENT_MENTION_PAGE_SIZE],
    queryFn: ({ pageParam }) => getFollowingPage(pageParam, COMMENT_MENTION_PAGE_SIZE),
    initialPageParam: 1,
    getNextPageParam: nextCandidatePage,
    enabled: isAuthenticated && query !== null && !showSearch,
  });
  const searchQuery = useInfiniteQuery({
    queryKey: ['follow', 'search', 'mention', debouncedQuery, COMMENT_MENTION_PAGE_SIZE],
    queryFn: ({ pageParam }) => searchUsersPage(debouncedQuery, pageParam, COMMENT_MENTION_PAGE_SIZE),
    initialPageParam: 1,
    getNextPageParam: nextCandidatePage,
    enabled: isAuthenticated && showSearch,
  });
  const activeQuery = showSearch ? searchQuery : followingQuery;
  const items = useMemo(
    () => collectUsers(activeQuery.data?.pages),
    [activeQuery.data?.pages],
  );

  const loadMore = () => {
    if (activeQuery.hasNextPage && !activeQuery.isFetchingNextPage) {
      void activeQuery.fetchNextPage();
    }
  };

  return {
    items,
    isLoading: activeQuery.isLoading,
    isError: activeQuery.isError,
    loadMore,
  };
}
