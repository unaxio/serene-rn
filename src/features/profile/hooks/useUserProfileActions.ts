import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useState } from 'react';

import { followUser, unfollowUser } from '@/src/features/follow/api';
import { FOLLOW_QUERY_KEYS } from '@/src/features/follow/constants';
import { getUserContents } from '@/src/features/profile/api';
import { PROFILE_QUERY_KEYS } from '@/src/features/profile/constants';
import { useProfileInfiniteQuery } from '@/src/features/profile/hooks/useProfileInfiniteQuery';
import { useUserHomeData } from '@/src/features/profile/hooks/useUserHomeData';
import type { ProfileShareItem } from '@/src/features/profile/types';
import { useSquareAction } from '@/src/features/square/hooks/useSquareAction';
import { toastCaughtFailure } from '@/src/utils/requestError';
import { showToast } from '@/src/utils/toast';

type UserContentType = 'stories' | 'shares' | 'asks';
type ContentTab = 'story' | 'share' | 'ask';

function toApiType(tab: ContentTab): UserContentType {
  if (tab === 'story') {
    return 'stories';
  }
  if (tab === 'share') {
    return 'shares';
  }
  return 'asks';
}

export function useUserProfileActions(userId: string) {
  const queryClient = useQueryClient();
  const homeQuery = useUserHomeData(userId);
  const [contentType, setContentType] = useState<ContentTab>('story');
  const [flowerOpen, setFlowerOpen] = useState(false);
  const [detailShare, setDetailShare] = useState<ProfileShareItem | null>(null);
  const { runAction, isPending } = useSquareAction();
  const apiType = toApiType(contentType);
  const home = homeQuery.data;

  const contents = useProfileInfiniteQuery(
    PROFILE_QUERY_KEYS.userContents(userId, apiType),
    (page, pageSize) => getUserContents(userId, apiType, page, pageSize),
    userId.length > 0 && Boolean(home) && !home?.isBlockedMe,
  );

  const followMutation = useMutation({
    mutationFn: async (nextFollow: boolean) => {
      if (nextFollow) {
        await followUser(userId);
        return;
      }
      await unfollowUser(userId);
    },
    onSuccess: async (_data, nextFollow) => {
      await queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEYS.userHome(userId) });
      await queryClient.invalidateQueries({ queryKey: FOLLOW_QUERY_KEYS.following });
      await queryClient.invalidateQueries({ queryKey: FOLLOW_QUERY_KEYS.followers });
      showToast(nextFollow ? '关注成功' : '已取消关注');
    },
    onError: toastCaughtFailure,
  });

  const handleSendFlower = useCallback(
    async (giftFlowerId: string, quantity: number) => {
      const result = await runAction({
        targetType: 'user',
        targetId: userId,
        actionType: 'flower',
        giftFlowerId,
        quantity,
      });
      return result !== null;
    },
    [runAction, userId],
  );

  const handlePressShare = useCallback((share: ProfileShareItem) => {
    setDetailShare(share);
  }, []);

  const closeShareDetail = useCallback(() => {
    setDetailShare(null);
  }, []);

  return {
    homeQuery,
    home,
    blocked: Boolean(home?.isBlockedByMe || home?.isBlockedMe),
    contentType,
    setContentType,
    apiType,
    contents,
    followMutation,
    flowerOpen,
    setFlowerOpen,
    isFlowerPending: isPending,
    handleSendFlower,
    detailShare,
    handlePressShare,
    closeShareDetail,
  };
}
