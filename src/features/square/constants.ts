import type { SquareSubTabId } from './types';

export const SQUARE_PAGE_SIZE = 20;

export const STORY_SUMMARY_MAX_LENGTH = 100;

export const FLOWER_QUANTITY_MIN = 1;

export const FLOWER_QUANTITY_MAX = 99;

export const TOP_REPLIES_PREVIEW_COUNT = 2;

export const ANONYMOUS_DISPLAY_NAME = '匿名用户';

export const ALL_TOPIC_CATEGORY = 'all';

export const COMING_SOON_MESSAGE = '功能开发中';

export const SQUARE_PAGE_BG = '#F8FAFC';

export const MUTED_TEXT_COLOR = '#64748B';

export const PLACEHOLDER_TEXT_COLOR = '#94A3B8';

export const SEARCH_BAR_BG = '#F1F5F9';

export const CARD_BORDER_COLOR = '#EEEFF3';

export const ACCENT_COLOR = '#7B6CF9';

export const COMMENT_HIGHLIGHT_COLOR = '#6F72F1';

export const STORY_TOPIC_TABS = [
  { id: ALL_TOPIC_CATEGORY, name: '全部' },
  { id: '婚恋', name: '婚恋' },
  { id: '职场', name: '职场' },
  { id: '亲子', name: '亲子' },
  { id: '成长', name: '成长' },
  { id: '人际', name: '人际' },
  { id: '家庭', name: '家庭' },
] as const;

export const SQUARE_SUB_TABS: { id: SquareSubTabId; label: string }[] = [
  { id: 'story', label: '故事' },
  { id: 'share', label: '分享' },
  { id: 'ask', label: '问答' },
];

export const PUBLISH_MENU_ITEMS = [
  { id: 'share', label: '分享' },
  { id: 'story', label: '投稿' },
  { id: 'ask', label: '提问' },
] as const;

export const SQUARE_QUERY_KEYS = {
  stories: (category: string) => ['square', 'stories', category] as const,
  storyDetail: (id: string) => ['square', 'story', id] as const,
  comments: (targetType: string, targetId: string) =>
    ['square', 'comments', targetType, targetId] as const,
  commentReplies: (rootId: string) =>
    ['square', 'commentReplies', rootId] as const,
};
