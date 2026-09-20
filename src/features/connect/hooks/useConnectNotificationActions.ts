import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';

import { markConnectNotificationRead } from '@/src/features/connect/api';
import { CONNECT_QUERY_KEYS } from '@/src/features/connect/constants';
import type { ConnectNotification, ConnectNotificationCategory } from '@/src/features/connect/types';
import { openConnectLink } from '@/src/features/connect/utils/openConnectLink';
import { followUser, unfollowUser } from '@/src/features/follow/api';
import { useSquareAction } from '@/src/features/square/hooks/useSquareAction';
import { toastCaughtFailure } from '@/src/utils/requestError';

export function useConnectNotificationActions(category: ConnectNotificationCategory) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { runAction, isPending } = useSquareAction();
  const [flowerUserId, setFlowerUserId] = useState<string | null>(null);

  const markRead = useCallback(
    async (item: ConnectNotification) => {
      if (item.isRead) {
        return;
      }
      try {
        await markConnectNotificationRead(item.id);
        await queryClient.invalidateQueries({ queryKey: CONNECT_QUERY_KEYS.notifications(category) });
        await queryClient.invalidateQueries({ queryKey: CONNECT_QUERY_KEYS.unread });
      } catch (error) {
        toastCaughtFailure(error);
      }
    },
    [category, queryClient],
  );

  const handlePress = useCallback(
    (item: ConnectNotification) => {
      void markRead(item);
      if (category === 'system') {
        router.push(`/connect/system/${item.id}`);
        return;
      }
      openConnectLink(router, item.link);
    },
    [category, markRead, router],
  );

  const toggleFollow = useCallback(
    async (userId: string, following: boolean) => {
      try {
        if (following) {
          await unfollowUser(userId);
        } else {
          await followUser(userId);
        }
        await queryClient.invalidateQueries({ queryKey: CONNECT_QUERY_KEYS.notifications(category) });
      } catch (error) {
        toastCaughtFailure(error);
      }
    },
    [category, queryClient],
  );

  const handleAction = useCallback(
    (item: ConnectNotification) => {
      void markRead(item);
      const actorId = item.actor?.id;
      if (category === 'flowers' && actorId) {
        setFlowerUserId(actorId);
        return;
      }
      if (category === 'follow-visit' && actorId && item.extra?.event === 'follow') {
        const following = item.extra.relation === 'following' || item.extra.relation === 'mutual';
        void toggleFollow(actorId, following);
        return;
      }
      if (category === 'comment-reply') {
        openConnectLink(router, item.link, item.extra?.replyToId ?? item.link?.id);
        return;
      }
      openConnectLink(router, item.link);
    },
    [category, markRead, router, toggleFollow],
  );

  const handleSendFlower = useCallback(
    async (giftFlowerId: string, quantity: number) => {
      if (!flowerUserId) {
        return false;
      }
      const result = await runAction({
        targetType: 'user',
        targetId: flowerUserId,
        actionType: 'flower',
        giftFlowerId,
        quantity,
      });
      return result !== null;
    },
    [flowerUserId, runAction],
  );

  return {
    handlePress,
    handleAction,
    flowerUserId,
    setFlowerUserId,
    isPending,
    handleSendFlower,
  };
}
