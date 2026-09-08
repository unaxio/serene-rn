import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';

import {
  DELETE_CONFIRM_LABEL,
  DELETE_CONFIRM_MESSAGE,
  DELETE_CONFIRM_TITLE,
  DELETE_SUCCESS_MESSAGE,
  FOLLOW_ANONYMOUS_BLOCKED,
  FOLLOW_SUCCESS_MESSAGE,
  REPORT_SUCCESS_MESSAGE,
  UNFOLLOW_SUCCESS_MESSAGE,
} from '@/src/features/square/constants';
import { followUser, getFollowingList, unfollowUser } from '@/src/features/follow/api';
import { FOLLOW_QUERY_KEYS } from '@/src/features/follow/constants';
import { createNotInterested, createReport } from '@/src/features/square/moderationApi';
import { useRequireAuth } from '@/src/features/square/hooks/useRequireAuth';
import type { Share } from '@/src/features/square/types';
import {
  deleteContentByKind,
  invalidateAfterContentDelete,
} from '@/src/features/square/utils/contentMoreMutations';
import { dispatchContentMoreAction } from '@/src/features/square/utils/dispatchContentMoreAction';
import {
  isOwnAuthor,
  type ContentMoreActionId,
  type ContentMoreKind,
} from '@/src/features/square/utils/contentMoreActions';
import { useAuthStore } from '@/src/store/authStore';
import { toastCaughtFailure } from '@/src/utils/requestError';
import { showToast } from '@/src/utils/toast';

interface UseContentMoreControllerParams {
  contentKind: ContentMoreKind;
  targetId: string;
  authorId?: string | null;
  askId?: string | null;
  shareSnapshot?: Share | null;
  onDeleted?: () => void;
}

export function useContentMoreController({
  contentKind,
  targetId,
  authorId = null,
  askId = null,
  shareSnapshot = null,
  onDeleted,
}: UseContentMoreControllerParams) {
  const router = useRouter();
  const requireAuth = useRequireAuth();
  const queryClient = useQueryClient();
  const currentUserId = useAuthStore((state) => state.user?.id);
  const isAuthenticated = useAuthStore((state) => state.status === 'authenticated');
  const isOwn = isOwnAuthor(authorId, currentUserId);

  const [menuVisible, setMenuVisible] = useState(false);
  const [reportVisible, setReportVisible] = useState(false);
  const [deleteVisible, setDeleteVisible] = useState(false);

  const followingQuery = useQuery({
    queryKey: FOLLOW_QUERY_KEYS.following,
    queryFn: getFollowingList,
    enabled: isAuthenticated && !isOwn && Boolean(authorId),
    staleTime: 60_000,
  });

  const isFollowing = useMemo(
    () =>
      Boolean(authorId) &&
      (followingQuery.data ?? []).some((user) => user.userId === authorId),
    [authorId, followingQuery.data],
  );

  const followMutation = useMutation({
    mutationFn: async (nextFollow: boolean) => {
      if (!authorId) {
        throw new Error(FOLLOW_ANONYMOUS_BLOCKED);
      }
      if (nextFollow) {
        await followUser(authorId);
        return;
      }
      await unfollowUser(authorId);
    },
    onSuccess: async (_data, nextFollow) => {
      await queryClient.invalidateQueries({ queryKey: FOLLOW_QUERY_KEYS.following });
      showToast(nextFollow ? FOLLOW_SUCCESS_MESSAGE : UNFOLLOW_SUCCESS_MESSAGE);
    },
    onError: toastCaughtFailure,
  });

  const reportMutation = useMutation({
    mutationFn: (input: { reason: string; detail: string }) =>
      createReport({
        targetType: contentKind,
        targetId,
        reason: input.reason,
        detail: input.detail || undefined,
      }),
    onError: toastCaughtFailure,
  });

  const notInterestedMutation = useMutation({
    mutationFn: () => createNotInterested({ targetType: contentKind, targetId }),
    onError: toastCaughtFailure,
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteContentByKind(contentKind, targetId),
    onError: toastCaughtFailure,
  });

  const handleAction = useCallback(
    (actionId: ContentMoreActionId) => {
      dispatchContentMoreAction(actionId, {
        contentKind,
        targetId,
        authorId,
        askId,
        shareSnapshot,
        requireAuth,
        queryClient,
        router,
        follow: (nextFollow) => followMutation.mutateAsync(nextFollow),
        markNotInterested: () => notInterestedMutation.mutateAsync(),
        openReport: () => setReportVisible(true),
        openDelete: () => setDeleteVisible(true),
      });
    },
    [
      askId,
      authorId,
      contentKind,
      followMutation,
      notInterestedMutation,
      queryClient,
      requireAuth,
      router,
      shareSnapshot,
      targetId,
    ],
  );

  const submitReport = useCallback(
    async (reason: string, detail: string) => {
      try {
        await reportMutation.mutateAsync({ reason, detail });
        setReportVisible(false);
        showToast(REPORT_SUCCESS_MESSAGE);
        return true;
      } catch {
        return false;
      }
    },
    [reportMutation],
  );

  const confirmDelete = useCallback(async () => {
    try {
      await deleteMutation.mutateAsync();
      setDeleteVisible(false);
      await invalidateAfterContentDelete(queryClient, contentKind, targetId, askId);
      showToast(DELETE_SUCCESS_MESSAGE);
      onDeleted?.();
    } catch {
      // toast via mutation / axios
    }
  }, [askId, contentKind, deleteMutation, onDeleted, queryClient, targetId]);

  return {
    isOwn,
    isFollowing,
    menuVisible,
    openMenu: () => setMenuVisible(true),
    closeMenu: () => setMenuVisible(false),
    handleAction,
    reportVisible,
    closeReport: () => setReportVisible(false),
    submitReport,
    isReporting: reportMutation.isPending,
    deleteVisible,
    closeDelete: () => setDeleteVisible(false),
    confirmDelete,
    isDeleting: deleteMutation.isPending,
    deleteTitle: DELETE_CONFIRM_TITLE,
    deleteMessage: DELETE_CONFIRM_MESSAGE,
    deleteConfirmLabel: DELETE_CONFIRM_LABEL,
  };
}
