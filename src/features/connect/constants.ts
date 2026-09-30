import type { ConnectNotificationCategory } from '@/src/features/connect/types';

export const CONNECT_PAGE_SIZE = 20;

export const CONNECT_BADGE_CAP = 99;

export const CONNECT_DM_TEXT_MAX = 2000;

export const CONNECT_DM_IMAGE_MAX = 9;

export const CONNECT_SEARCH_DEBOUNCE_MS = 300;

export const CONNECT_HIGHLIGHT_MS = 2000;

export const CONNECT_UNAVAILABLE_MESSAGE = '该内容暂不可查看';

export const PARTNER_INVITE_INVALID_MESSAGE = '邀请信息无效';

export const PARTNER_INVITE_ACCEPT_FAIL_MESSAGE = '同意组队失败';

export const PARTNER_INVITE_ACCEPT_SUCCESS_MESSAGE = '已同意组队';

export const PARTNER_INVITE_REJECT_LABEL = '拒绝';

export const PARTNER_INVITE_REJECT_FAIL_MESSAGE = '拒绝组队失败';

export const PARTNER_INVITE_REJECT_SUCCESS_MESSAGE = '已拒绝组队';

export const CONNECT_COMING_SOON_MESSAGE = '功能开发中';

export const DM_PEER_UNAVAILABLE_MESSAGE = '暂时无法发起私信';

export const CONNECT_BLOCKED_HINT = '已加入黑名单';

export const CONNECT_WITHDRAWN_MESSAGE = '该通知已撤回';

export const CONNECT_EMPTY_CONVERSATION = '暂无会话';

export const CONNECT_EMPTY_NOTIFICATION = '暂无消息';

export const CONNECT_EMPTY_SEARCH = '没有找到相关消息';

export const CONNECT_COPIED_MESSAGE = '已复制';

export const CONNECT_QUERY_KEYS = {
  home: ['connect', 'home'] as const,
  unread: ['connect', 'unread'] as const,
  notifications: (category: ConnectNotificationCategory) =>
    ['connect', 'notifications', category] as const,
  systemDetail: (id: string) => ['connect', 'system', id] as const,
  systemMute: ['connect', 'system', 'mute'] as const,
  aiRoles: ['connect', 'ai-roles'] as const,
  dmMessages: (conversationId: string) => ['connect', 'dm', conversationId] as const,
  dmSearch: (conversationId: string, keyword: string) =>
    ['connect', 'dm', conversationId, 'search', keyword] as const,
};

export const CONNECT_INTERACTION_ENTRIES: Array<{
  category: ConnectNotificationCategory;
  label: string;
  unreadKey: 'flowers' | 'resonateCollect' | 'followVisit' | 'mentionInvite' | 'commentReply';
}> = [
  { category: 'flowers', label: '收到的花', unreadKey: 'flowers' },
  { category: 'resonate-collect', label: '共鸣与收藏', unreadKey: 'resonateCollect' },
  { category: 'follow-visit', label: '关注与访客', unreadKey: 'followVisit' },
  { category: 'mention-invite', label: '@与邀请', unreadKey: 'mentionInvite' },
  { category: 'comment-reply', label: '评论与回复', unreadKey: 'commentReply' },
];

export const CONNECT_CATEGORY_TITLES: Record<ConnectNotificationCategory, string> = {
  flowers: '收到的花',
  'resonate-collect': '共鸣与收藏',
  'follow-visit': '关注与访客',
  'mention-invite': '@与邀请',
  'comment-reply': '评论与回复',
  system: '系统消息',
};

export const CONNECT_AI_EMOJIS = ['😀', '😂', '🥰', '😭', '👍', '🙏', '🌸', '🌙'] as const;

export const CONNECT_NOTIFICATION_CATEGORIES: ConnectNotificationCategory[] = [
  'flowers',
  'resonate-collect',
  'follow-visit',
  'mention-invite',
  'comment-reply',
  'system',
];
