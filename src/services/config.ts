/**
 * API 与网络相关配置
 */

export const API_BASE_URL = "http://localhost:8000/api";

export const HTTP_STATUS = {
  OK: 200,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
} as const;

export const AUTH_HEADER_PREFIX = "Bearer";

export const REQUEST_TIMEOUT_MS = 15_000;

export const API_PATHS = {
  AUTH_LOGIN: "/auth/login",
  AUTH_STATUS: "/auth/status",
  SOUL_FLOWER_TODAY_TASK: "/soul-flower/app/today-task",
  SOUL_FLOWER_SUBMIT_ANSWER: "/soul-flower/app/submit-answer",
  SOUL_FLOWER_MIND_MAP: "/soul-flower/app/mind-map/full-data",
  SOUL_FLOWER_PARTNER_STATUS: "/soul-flower/app/partner/status",
  SOUL_FLOWER_PARTNER_INVITE: "/soul-flower/app/partner/invite",
  SOUL_FLOWER_PARTNER_INVITES: "/soul-flower/app/partner/invites",
  SOUL_FLOWER_PARTNER_INVITE_HANDLE: "/soul-flower/app/partner/invite/handle",
} as const;

export const STORAGE_KEYS = {
  ACCESS_TOKEN: "access_token",
} as const;

export const API_SUCCESS_CODE = 200;
