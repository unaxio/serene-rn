/**
 * API 与网络相关配置
 */

/** 本地开发默认；Web 测试构建通过 EXPO_PUBLIC_API_BASE_URL 注入 */
export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:8000/api';

/** 测试环境 Web 部署的 API 地址 */
export const TEST_API_BASE_URL = 'https://test.serene.org.cn/api';

/** 对外可访问的 Web 站点 origin，供复制链接使用 */
export const WEB_PUBLIC_ORIGIN = 'https://test.serene.org.cn';

/** 测试环境 Web 子路径（与 experiments.baseUrl 一致） */
export const TEST_WEB_BASE_PATH = '/flower';

export const HTTP_STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
} as const;

export const NETWORK_ERROR_MESSAGE = '网络异常，请稍后重试';

export const AUTH_HEADER_PREFIX = 'Bearer';

export const REQUEST_TIMEOUT_MS = 15_000;

export const API_PATHS = {
  AUTH_LOGIN: '/auth/login',
  AUTH_STATUS: '/auth/status',
  USERS: '/users',
  SOUL_FLOWER_TODAY_TASK: '/soul-flower/app/today-task',
  SOUL_FLOWER_SUBMIT_ANSWER: '/soul-flower/app/submit-answer',
  SOUL_FLOWER_MIND_MAP: '/soul-flower/app/mind-map/full-data',
  SOUL_FLOWER_PARTNER_STATUS: '/soul-flower/app/partner/status',
  SOUL_FLOWER_PARTNER_INVITE: '/soul-flower/app/partner/invite',
  SOUL_FLOWER_PARTNER_INVITES: '/soul-flower/app/partner/invites',
  SOUL_FLOWER_PARTNER_INVITE_HANDLE: '/soul-flower/app/partner/invite/handle',
  SOUL_FLOWER_FLOWER_CARD_ANSWERS: '/soul-flower/app/flower-card',
  SOUL_FLOWER_CHECKIN_RECORDS: '/soul-flower/app/checkin-records',
  SOUL_FLOWER_LIGHT_CARD_USE: '/soul-flower/app/light-card/use',
  FOLLOW_FOLLOWING: '/follow/following',
  FOLLOW_FOLLOWERS: '/follow/followers',
  FOLLOW: '/follow',
  FOLLOW_SEARCH: '/follow/search',
  SQUARE_STORIES: '/soul-flower/app/stories',
  SQUARE_SHARES: '/soul-flower/app/shares',
  SQUARE_ASKS: '/soul-flower/app/asks',
  SQUARE_ASK_ANSWERS: '/soul-flower/app/ask-answers',
  SQUARE_COMMENTS: '/soul-flower/app/comments',
  SQUARE_ACTIONS: '/soul-flower/app/actions',
  SQUARE_IMAGE_UPLOAD: '/upload/sf-square-image',
  GIFT_FLOWERS: '/soul-flower/app/gift-flowers',
  GIFT_FLOWER_INVENTORY: '/soul-flower/app/gift-flowers/inventory',
  GIFT_FLOWER_PURCHASE: '/soul-flower/app/gift-flowers/purchase',
  GIFT_FLOWER_LEDGERS: '/soul-flower/app/actions/flowers',
} as const;

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
} as const;

export const API_SUCCESS_CODE = 200;
