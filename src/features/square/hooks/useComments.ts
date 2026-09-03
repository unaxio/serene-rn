import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';

import { createComment, createReply, getComments } from '@/src/features/square/api';
import {
  SQUARE_PAGE_SIZE,
  SQUARE_QUERY_KEYS,
} from '@/src/features/square/constants';
import type { SquareTargetType } from '@/src/features/square/types';
import { useRequireAuth } from '@/src/features/square/hooks/useRequireAuth';

interface UseCommentsParams {
  targetType: SquareTargetType;
  targetId: string;
  enabled: boolean;
}

function getNextPageParam(lastPage: {
  page: number;
  pageSize: number;
  total: number;
}): number | undefined {
  const loaded = lastPage.page * lastPage.pageSize;
  return loaded < lastPage.total ? lastPage.page + 1 : undefined;
}

export function useComments({ targetType, targetId, enabled }: UseCommentsParams) {
  const requireAuth = useRequireAuth();
  const queryClient = useQueryClient();
  const queryKey = SQUARE_QUERY_KEYS.comments(targetType, targetId);

  const query = useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam }) =>
      getComments({
        targetType,
        targetId,
        page: pageParam,
        pageSize: SQUARE_PAGE_SIZE,
      }),
    initialPageParam: 1,
    getNextPageParam,
    enabled,
  });

  const items = useMemo(
    () => query.data?.pages.flatMap((page) => page.items) ?? [],
    [query.data?.pages],
  );

  const total = query.data?.pages[0]?.total ?? items.length;

  const invalidate = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey });
    if (targetType === 'story') {
      await queryClient.invalidateQueries({
        queryKey: SQUARE_QUERY_KEYS.storyDetail(targetId),
      });
    }
  }, [queryClient, queryKey, targetId, targetType]);

  const createMutation = useMutation({
    mutationFn: (content: string) => createComment({ targetType, targetId, content }),
  });

  const replyMutation = useMutation({
    mutationFn: (payload: { rootId: string; parentId: string; content: string }) =>
      createReply({
        targetType,
        targetId,
        rootId: payload.rootId,
        parentId: payload.parentId,
        content: payload.content,
      }),
  });

  const submitComment = useCallback(
    async (content: string) => {
      if (!requireAuth()) {
        return null;
      }
      try {
        const result = await createMutation.mutateAsync(content);
        await invalidate();
        return result;
      } catch {
        return null;
      }
    },
    [createMutation, invalidate, requireAuth],
  );

  const submitReply = useCallback(
    async (rootId: string, parentId: string, content: string) => {
      if (!requireAuth()) {
        return null;
      }
      try {
        const result = await replyMutation.mutateAsync({ rootId, parentId, content });
        await invalidate();
        await queryClient.invalidateQueries({
          queryKey: SQUARE_QUERY_KEYS.commentReplies(rootId),
        });
        return result;
      } catch {
        return null;
      }
    },
    [invalidate, queryClient, requireAuth, replyMutation],
  );

  const loadMore = useCallback(() => {
    if (query.hasNextPage && !query.isFetchingNextPage) {
      void query.fetchNextPage();
    }
  }, [query]);

  return {
    items,
    total,
    isLoading: query.isLoading,
    isError: query.isError,
    isFetchingNextPage: query.isFetchingNextPage,
    hasNextPage: Boolean(query.hasNextPage),
    isSubmitting: createMutation.isPending || replyMutation.isPending,
    loadMore,
    refresh: query.refetch,
    submitComment,
    submitReply,
  };
}
