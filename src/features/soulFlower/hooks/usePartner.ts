import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

import {
  getPartnerInvites,
  getPartnerStatus,
  handlePartnerInvite,
  sendPartnerInvite,
} from '@/src/features/soulFlower/api';
import { SOUL_FLOWER_QUERY_KEYS } from '@/src/features/soulFlower/constants';
import type { PartnerInviteAction } from '@/src/features/soulFlower/types';
import { showErrorToast, showToast } from '@/src/utils/toast';

export function usePartnerStatus() {
  const query = useQuery({
    queryKey: SOUL_FLOWER_QUERY_KEYS.partnerStatus,
    queryFn: getPartnerStatus,
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
}

export function usePartnerInvites(enabled: boolean) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: SOUL_FLOWER_QUERY_KEYS.partnerInvites,
    queryFn: getPartnerInvites,
    enabled,
  });

  const inviteMutation = useMutation({
    mutationFn: (receiverUserId: string) => sendPartnerInvite(receiverUserId),
    onSuccess: async (result) => {
      if (!result.success) {
        showErrorToast(result.message ?? '发送邀请失败');
        return;
      }
      showToast(result.message ?? '邀请已发送');
      await queryClient.invalidateQueries({
        queryKey: SOUL_FLOWER_QUERY_KEYS.partnerInvites,
      });
    },
  });

  const handleMutation = useMutation({
    mutationFn: ({
      inviteId,
      action,
    }: {
      inviteId: string;
      action: PartnerInviteAction;
    }) => handlePartnerInvite(inviteId, action),
    onSuccess: async (result) => {
      if (!result.success) {
        showErrorToast(result.message ?? '处理邀请失败');
        return;
      }
      showToast(result.message ?? '已处理邀请');
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: SOUL_FLOWER_QUERY_KEYS.partnerInvites,
        }),
        queryClient.invalidateQueries({
          queryKey: SOUL_FLOWER_QUERY_KEYS.partnerStatus,
        }),
      ]);
    },
  });

  const sendInvite = useCallback(
    async (receiverUserId: string) => {
      const trimmed = receiverUserId.trim();
      if (!trimmed) {
        showErrorToast('请输入伙伴用户 ID');
        return;
      }
      await inviteMutation.mutateAsync(trimmed);
    },
    [inviteMutation],
  );

  const respondInvite = useCallback(
    async (inviteId: string, action: PartnerInviteAction) => {
      await handleMutation.mutateAsync({ inviteId, action });
    },
    [handleMutation],
  );

  return {
    invites: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
    sendInvite,
    respondInvite,
    isSending: inviteMutation.isPending,
    isHandling: handleMutation.isPending,
  };
}
