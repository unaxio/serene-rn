import { ACCENT_COLOR, MUTED_TEXT_COLOR, SQUARE_PAGE_BG } from '@/src/features/square/constants';

export const PROFILE_PAGE_BG = SQUARE_PAGE_BG;
export const PROFILE_ACCENT = ACCENT_COLOR;
export const PROFILE_MUTED = MUTED_TEXT_COLOR;
export const PROFILE_SURFACE = '#FFFFFF';

export const PROFILE_BIO_MAX_LENGTH = 60;

export const PROFILE_CONTENT_TABS = [
  { id: 'publish', label: '发布' },
  { id: 'comment', label: '评论' },
  { id: 'flower', label: '送花' },
  { id: 'collect', label: '收藏' },
  { id: 'resonate', label: '共鸣' },
] as const;

export type ProfileContentTabId = (typeof PROFILE_CONTENT_TABS)[number]['id'];

export const PROFILE_PUBLISH_SUB_TABS = [
  { id: 'story', label: '故事' },
  { id: 'share', label: '分享' },
  { id: 'ask', label: '问答' },
] as const;

export const PROFILE_COLLECT_SUB_TABS = [
  { id: 'story', label: '故事' },
  { id: 'ask', label: '问答' },
  { id: 'comment', label: '评论' },
] as const;

export const PROFILE_RESONATE_SUB_TABS = [
  { id: 'story', label: '故事' },
  { id: 'ask', label: '问答' },
  { id: 'share', label: '分享' },
  { id: 'comment', label: '评论' },
] as const;

export const FLOWER_INVENTORY_FILTERS = [
  { id: 'all', label: '全部' },
  { id: 'sendable', label: '可送的花' },
  { id: 'received', label: '获赠花' },
] as const;

export type FlowerInventoryFilterId = (typeof FLOWER_INVENTORY_FILTERS)[number]['id'];

export const PROFILE_GET_PETAL_HINT = '请联系客服获取花瓣';

export const PROFILE_GENDER_OPTIONS = [
  { id: 'secret', label: '保密' },
  { id: 'male', label: '男' },
  { id: 'female', label: '女' },
  { id: 'other', label: '其他' },
] as const;

export const RELATIONSHIP_STATUS_OPTIONS = [
  { id: '', label: '未设置' },
  { id: 'single', label: '单身' },
  { id: 'in_relationship', label: '恋爱中' },
  { id: 'married', label: '已婚' },
  { id: 'complicated', label: '一言难尽' },
] as const;

export const REGION_PICKER_TITLE = '选择地区';
export const REGION_FIELD_PLACEHOLDER = '请选择所在地区';
export const REGION_BREADCRUMB_HINT = '请选择';
export const REGION_EMPTY_MESSAGE = '暂无地区';
export const REGION_LOAD_ERROR = '地区加载失败，点击重试';
export const REGION_NOT_LEAF_MESSAGE = '请选择到最后一级';
export const REGION_INVALID_MESSAGE = '地区数据无效';
export const REGION_CLEAR_LABEL = '清除所在地区';

export const PROFILE_QUERY_KEYS = {
  home: ['profile', 'me', 'home'] as const,
  userHome: (userId: string) => ['profile', 'user', userId, 'home'] as const,
  resonateReceived: ['profile', 'me', 'resonate-received'] as const,
  flowersReceived: ['profile', 'me', 'flowers-received'] as const,
  giftFlowersReceived: ['profile', 'gift-flowers-received'] as const,
  myStories: ['profile', 'me', 'contents', 'stories'] as const,
  myShares: ['profile', 'me', 'contents', 'shares'] as const,
  myAsks: ['profile', 'me', 'contents', 'asks'] as const,
  myComments: ['profile', 'me', 'contents', 'comments'] as const,
  myFlowersSent: ['profile', 'me', 'contents', 'flowers-sent'] as const,
  myCollections: (kind: string) => ['profile', 'me', 'collections', kind] as const,
  myResonates: (kind: string) => ['profile', 'me', 'resonates', kind] as const,
  userContents: (userId: string, type: string) =>
    ['profile', 'user', userId, 'contents', type] as const,
  promotePlans: ['profile', 'promote', 'plans'] as const,
  privacy: ['profile', 'me', 'privacy'] as const,
  notificationSettings: ['profile', 'me', 'notification-settings'] as const,
  blacklist: ['profile', 'me', 'blacklist'] as const,
  accountSecurity: ['profile', 'me', 'account', 'security'] as const,
  accountDevices: ['profile', 'me', 'account', 'devices'] as const,
  helpFaqs: ['profile', 'me', 'help', 'faqs'] as const,
  helpTickets: ['profile', 'me', 'help', 'tickets'] as const,
  notifications: (category?: string) =>
    ['profile', 'me', 'notifications', category ?? 'all'] as const,
  unreadCount: ['profile', 'me', 'notifications', 'unread'] as const,
  membership: ['profile', 'me', 'membership'] as const,
  regions: (parentCode?: string) => ['regions', parentCode ?? 'root'] as const,
};

export const PROFILE_PAGE_SIZE = 20;
