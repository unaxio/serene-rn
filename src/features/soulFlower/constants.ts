import type { ThemeColor } from './types';

export { APP_TEXT_COLOR } from '@/constants/Colors';

export const SOUL_FLOWER_QUERY_KEYS = {
  todayTask: ['soulFlower', 'todayTask'] as const,
  mindMap: ['soulFlower', 'mindMap'] as const,
  partnerStatus: ['soulFlower', 'partnerStatus'] as const,
  partnerInvites: ['soulFlower', 'partnerInvites'] as const,
  flowerCardAnswers: (flowerId: string) =>
    ['soulFlower', 'flowerCardAnswers', flowerId] as const,
};

export const DEFAULT_FLOWER_NAME = '心灵之花';

export const PETAL_SLOT_COUNT = 6;

export const LIGHTED_PEOPLE_LABEL = '已有 8,326 人点亮';

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

/** 花卡详情页使用的花色 */
export const FLOWER_THEME_HEX: Record<ThemeColor, string> = {
  red: '#EF7D89',
  orange: '#D7742F',
  yellow: '#E0AF4A',
  green: '#94B798',
  blue: '#93AFCF',
  purple: '#8C7BBC',
  silver: '#AEB7C2',
};

export const FLOWER_CARD_INNER_BG = require('../../../assets/images/flower-card-inner-bg.png');

export const PETAL_BLANK_IMAGE = require('../../../assets/images/petal/petal_blank_point_down.png');

export const PETAL_DEFAULT_IMAGE = require('../../../assets/images/petal-default.png');

export const PETAL_FILLED_IMAGES: Record<ThemeColor, number> = {
  red: require('../../../assets/images/petal/petal_red_point_down.png'),
  orange: require('../../../assets/images/petal/petal_orange_point_down.png'),
  yellow: require('../../../assets/images/petal/petal_yellow_point_down.png'),
  green: require('../../../assets/images/petal/petal_green_point_down.png'),
  blue: require('../../../assets/images/petal/petal_blue_point_down.png'),
  purple: require('../../../assets/images/petal/petal_purple_point_down.png'),
  silver: require('../../../assets/images/petal/petal_silver_point_down.png'),
};

export const SUMMARY_NODE_IMAGES: Record<ThemeColor, number> = {
  red: require('../../../assets/images/summary/node_red.png'),
  orange: require('../../../assets/images/summary/node_orange.png'),
  yellow: require('../../../assets/images/summary/node_yellow.png'),
  green: require('../../../assets/images/summary/node_green.png'),
  blue: require('../../../assets/images/summary/node_blue.png'),
  purple: require('../../../assets/images/summary/node_purple.png'),
  silver: require('../../../assets/images/summary/node_silver.png'),
};

export const DESIGN_CARD_WIDTH = 400;
export const DESIGN_CARD_HEIGHT = 500;
export const DESIGN_BODY_HEIGHT = 432;
export const DESIGN_FOOTER_HEIGHT = 68;
export const CARD_HORIZONTAL_MARGIN = 18;
export const CARD_CORNER_RADIUS = 20;
export const DESIGN_PETAL_WIDTH = 16;
export const DESIGN_PETAL_HEIGHT = 17;
export const DESIGN_PETAL_GAP = 25;
export const DETAIL_PAGE_BG = '#F5F5F5';

/** 觉察 AI 回应强调色 */
export const AI_ACCENT_COLOR = '#6f72f1';

/** 觉察主按钮 / 选项选中环共用渐变 */
export const AWARENESS_ACCENT_GRADIENT = ['#5c9afb', '#878df8', '#c598ef'] as const;

export const AWARENESS_ACCENT_GRADIENT_LOCATIONS = [0, 0.5, 1] as const;

export const SUBMIT_ANSWER_TIMEOUT_MS = 300_000;
