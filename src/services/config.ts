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
  SOUL_FLOWER_PARTNER_DISSOLVE: '/soul-flower/app/partner/dissolve',
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
  SQUARE_SEARCH: '/soul-flower/app/search',
  SQUARE_COMMENTS: '/soul-flower/app/comments',
  SQUARE_ACTIONS: '/soul-flower/app/actions',
  SQUARE_REPORTS: '/soul-flower/app/reports',
  SQUARE_NOT_INTERESTED: '/soul-flower/app/not-interested',
  SQUARE_IMAGE_UPLOAD: '/upload/sf-square-image',
  GIFT_FLOWERS: '/soul-flower/app/gift-flowers',
  GIFT_FLOWER_INVENTORY: '/soul-flower/app/gift-flowers/inventory',
  GIFT_FLOWER_RECEIVED: '/soul-flower/app/gift-flowers/received',
  GIFT_FLOWER_PURCHASE: '/soul-flower/app/gift-flowers/purchase',
  GIFT_FLOWER_LEDGERS: '/soul-flower/app/actions/flowers',
  PROFILE_ME_HOME: '/soul-flower/app/me/home',
  PROFILE_ME_PROFILE: '/soul-flower/app/me/profile',
  REGIONS: '/regions',
  PROFILE_USER_HOME: '/soul-flower/app/users',
  PROFILE_AVATAR_UPLOAD: '/upload/sf-avatar',
  PROFILE_RESONATE_RECEIVED: '/soul-flower/app/me/resonate-received',
  PROFILE_FLOWERS_RECEIVED: '/soul-flower/app/me/flowers/received',
  PROFILE_ME_CONTENTS: '/soul-flower/app/me/contents',
  PROFILE_PROMOTE_PLANS: '/soul-flower/app/promote/plans',
  PROFILE_PROMOTE_ORDERS: '/soul-flower/app/promote/orders',
  PROFILE_PRIVACY_SETTINGS: '/soul-flower/app/me/privacy-settings',
  PROFILE_NOTIFICATION_SETTINGS: '/soul-flower/app/me/notification-settings',
  PROFILE_BLACKLIST: '/soul-flower/app/me/blacklist',
  PROFILE_USER_REPORTS: '/soul-flower/app/user-reports',
  PROFILE_ACCOUNT_SECURITY: '/soul-flower/app/me/account/security',
  PROFILE_ACCOUNT_DEVICES: '/soul-flower/app/me/account/devices',
  PROFILE_ACCOUNT_DELETE: '/soul-flower/app/me/account/delete',
  PROFILE_HELP_FAQS: '/soul-flower/app/me/help/faqs',
  PROFILE_HELP_FEEDBACK: '/soul-flower/app/me/help/feedback',
  PROFILE_HELP_TICKETS: '/soul-flower/app/me/help/tickets',
  PROFILE_NOTIFICATIONS: '/soul-flower/app/me/notifications',
  PROFILE_NOTIFICATIONS_READ: '/soul-flower/app/me/notifications/read',
  PROFILE_NOTIFICATIONS_UNREAD: '/soul-flower/app/me/notifications/unread-count',
  PROFILE_MEMBERSHIP: '/soul-flower/app/me/membership',
  CONNECT_HOME: '/soul-flower/app/connect/home',
  CONNECT_UNREAD: '/soul-flower/app/connect/unread',
  CONNECT_CONVERSATIONS: '/soul-flower/app/connect/conversations',
  CONNECT_NOTIFICATIONS: '/soul-flower/app/connect/notifications',
  CONNECT_SYSTEM_MESSAGES: '/soul-flower/app/connect/system-messages',
  CONNECT_AI_ROLES: '/soul-flower/app/connect/ai-chat/roles',
  CONNECT_AI_SESSIONS: '/soul-flower/app/connect/ai-chat/sessions',
  CONNECT_AI_SESSION_FROM_ANSWER: '/soul-flower/app/connect/ai-chat/sessions/from-answer',
  CONNECT_AI_STREAM: '/soul-flower/app/connect/ai-chat/stream',
  CONNECT_DM: '/soul-flower/app/connect/dm',
} as const;

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
} as const;

export const API_SUCCESS_CODE = 200;
