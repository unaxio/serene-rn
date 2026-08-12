import type { ThemeColor } from './types';

export const SOUL_FLOWER_QUERY_KEYS = {
  todayTask: ['soulFlower', 'todayTask'] as const,
  mindMap: ['soulFlower', 'mindMap'] as const,
  partnerStatus: ['soulFlower', 'partnerStatus'] as const,
  partnerInvites: ['soulFlower', 'partnerInvites'] as const,
};

export const DEFAULT_FLOWER_NAME = '心灵之花';

export const PETAL_SLOT_COUNT = 6;

export const LIGHTED_PEOPLE_LABEL = '已有 8,326 人点亮';

/** App 默认文字颜色 */
export const APP_TEXT_COLOR = '#1F195C';

export const ALL_CATEGORY_ID = 'all';

export const CATEGORY_TAB_GRADIENT = ['#717BFA', '#7B6CF9'] as const;

export const CATEGORY_TAB_INACTIVE_BG = '#FDFDFD';

export const MIND_MAP_GRID_COLUMNS = 3;

export const THEME_COLOR_STYLES: Record<
  ThemeColor,
  { background: string; accent: string; text: string; track: string }
> = {
  red: {
    background: '#FEE2E2',
    accent: '#EF4444',
    text: '#7F1D1D',
    track: '#FECACA',
  },
  orange: {
    background: '#FFEDD5',
    accent: '#F97316',
    text: '#9A3412',
    track: '#FED7AA',
  },
  yellow: {
    background: '#FEF9C3',
    accent: '#EAB308',
    text: '#854D0E',
    track: '#FEF08A',
  },
  green: {
    background: '#DCFCE7',
    accent: '#22C55E',
    text: '#14532D',
    track: '#BBF7D0',
  },
  blue: {
    background: '#DBEAFE',
    accent: '#3B82F6',
    text: '#1E3A8A',
    track: '#BFDBFE',
  },
  purple: {
    background: '#F3E8FF',
    accent: '#A855F7',
    text: '#581C87',
    track: '#E9D5FF',
  },
  silver: {
    background: '#F1F5F9',
    accent: '#64748B',
    text: '#334155',
    track: '#E2E8F0',
  },
};

export const DEFAULT_THEME_COLOR: ThemeColor = 'silver';

export const EMPTY_PROGRESS_LABEL = '0/0';
