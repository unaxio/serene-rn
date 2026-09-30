import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useCallback, useRef, useState } from 'react';

import { markConnectNotificationRead } from '@/src/features/connect/api';
import {
  CONNECT_QUERY_KEYS,
  PARTNER_INVITE_ACCEPT_FAIL_MESSAGE,
  PARTNER_INVITE_ACCEPT_SUCCESS_MESSAGE,
  PARTNER_INVITE_INVALID_MESSAGE,
  PARTNER_INVITE_REJECT_FAIL_MESSAGE,
  PARTNER_INVITE_REJECT_SUCCESS_MESSAGE,
} from '@/src/features/connect/constants';
import type { ConnectNotification, ConnectNotificationCategory } from '@/src/features/connect/types';
import { openConnectLink } from '@/src/features/connect/utils/openConnectLink';
import { canRespondPartnerInvite } from '@/src/features/connect/utils/partnerInviteNotice';
import { followUser, unfollowUser } from '@/src/features/follow/api';
import { SOUL_FLOWER_QUERY_KEYS } from '@/src/features/soulFlower/constants';
import { handlePartnerInvite } from '@/src/features/soulFlower/api';
import type { PartnerInviteAction } from '@/src/features/soulFlower/types';
import { useSquareAction } from '@/src/features/square/hooks/useSquareAction';
import { toastCaughtFailure } from '@/src/utils/requestError';
import { showErrorToast, showToast } from '@/src/utils/toast';

function partnerInviteId(item: ConnectNotification): string | null {
  const isPartnerInvite =
    item.link?.type === 'partner_invite' || item.extra?.event === 'partner_invite';
  if (!isPartnerInvite) {
    return null;
  }
  if (item.link?.type !== 'partner_invite') {
    return '';
  }
  return item.link.id?.trim() ?? '';
}

export function useConnectNotificationActions(category: ConnectNotificationCategory) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { runAction, isPending } = useSquareAction();
  const [flowerUserId, setFlowerUserId] = useState<string | null>(null);
  const acceptingInviteRef = useRef(false);

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
      if (partnerInviteId(item) !== null) {
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

  const respondPartnerInvite = useCallback(
    async (inviteId: string, action: PartnerInviteAction) => {
      if (acceptingInviteRef.current) {
        return;
      }
      acceptingInviteRef.current = true;
      const failMessage =
        action === 'accept' ? PARTNER_INVITE_ACCEPT_FAIL_MESSAGE : PARTNER_INVITE_REJECT_FAIL_MESSAGE;
      const successMessage =
        action === 'accept'
          ? PARTNER_INVITE_ACCEPT_SUCCESS_MESSAGE
          : PARTNER_INVITE_REJECT_SUCCESS_MESSAGE;
      try {
        const result = await handlePartnerInvite(inviteId, action);
        if (!result.success) {
          showErrorToast(result.message ?? failMessage);
          return;
        }
        showToast(result.message || successMessage);
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: CONNECT_QUERY_KEYS.notifications(category) }),
          queryClient.invalidateQueries({ queryKey: CONNECT_QUERY_KEYS.unread }),
          queryClient.invalidateQueries({ queryKey: SOUL_FLOWER_QUERY_KEYS.partnerStatus }),
          queryClient.invalidateQueries({ queryKey: SOUL_FLOWER_QUERY_KEYS.partnerInvites }),
          queryClient.invalidateQueries({ queryKey: SOUL_FLOWER_QUERY_KEYS.checkInRecords }),
        ]);
      } catch (error) {
        toastCaughtFailure(error);
      } finally {
        acceptingInviteRef.current = false;
      }
    },
    [category, queryClient],
  );

  const handleReject = useCallback(
    (item: ConnectNotification) => {
      void markRead(item);
      if (!canRespondPartnerInvite(item)) {
        return;
      }
      const inviteId = partnerInviteId(item);
      if (!inviteId) {
        showErrorToast(PARTNER_INVITE_INVALID_MESSAGE);
        return;
      }
      void respondPartnerInvite(inviteId, 'reject');
    },
    [markRead, respondPartnerInvite],
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
      const inviteId = partnerInviteId(item);
      if (inviteId !== null) {
        if (!canRespondPartnerInvite(item)) {
          return;
        }
        if (!inviteId) {
          showErrorToast(PARTNER_INVITE_INVALID_MESSAGE);
          return;
        }
        void respondPartnerInvite(inviteId, 'accept');
        return;
      }
      if (
        category === 'mention-invite' &&
        item.extra?.event === 'invite' &&
        item.link?.type === 'ask' &&
        item.link.id
      ) {
        router.push(`/asks/${item.link.id}/answer`);
        return;
      }
      openConnectLink(router, item.link);
    },
    [category, markRead, respondPartnerInvite, router, toggleFollow],
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
    handleReject,
    flowerUserId,
    setFlowerUserId,
    isPending,
    handleSendFlower,
  };
}
