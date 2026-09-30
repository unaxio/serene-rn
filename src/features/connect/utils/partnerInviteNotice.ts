import type { ConnectInviteStatus, ConnectNotification } from '@/src/features/connect/types';

const PARTNER_INVITE_EXPIRED_LABEL = '已失效';

const PARTNER_INVITE_STATUS_LABEL: Record<Exclude<ConnectInviteStatus, 'pending'>, string> = {
  accepted: '已同意',
  rejected: '已拒绝',
  canceled: '已取消',
};

export function isPartnerInviteNotice(item: ConnectNotification): boolean {
  return item.link?.type === 'partner_invite' || item.extra?.event === 'partner_invite';
}

export function canRespondPartnerInvite(item: ConnectNotification): boolean {
  return isPartnerInviteNotice(item) && item.inviteStatus === 'pending';
}

/** 非 pending 的组队邀请展示结果；@ 提醒和邀请回答不走这里。 */
export function settledPartnerInviteLabel(item: ConnectNotification): string | null {
  if (!isPartnerInviteNotice(item) || item.inviteStatus === 'pending') {
    return null;
  }
  if (item.inviteStatus) {
    return PARTNER_INVITE_STATUS_LABEL[item.inviteStatus];
  }
  return PARTNER_INVITE_EXPIRED_LABEL;
}
