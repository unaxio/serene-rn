import { API_PATHS, API_SUCCESS_CODE } from '@/src/services/config';
import { request } from '@/src/services/request';

import type {
  FollowActionResponse,
  FollowPagedData,
  FollowUser,
  FollowUserRaw,
} from './types';

interface ApiEnvelope<T> {
  statusCode: number;
  message: string;
  data?: T;
}

function isApiEnvelope<T>(value: unknown): value is ApiEnvelope<T> {
  return (
    typeof value === 'object' &&
    value !== null &&
    'statusCode' in value &&
    typeof (value as ApiEnvelope<T>).statusCode === 'number'
  );
}

function unwrapResponse<T>(payload: T | ApiEnvelope<T>, fallbackMessage: string): T {
  if (isApiEnvelope<T>(payload)) {
    if (payload.statusCode !== API_SUCCESS_CODE || payload.data === undefined) {
      throw new Error(payload.message || fallbackMessage);
    }
    return payload.data;
  }
  return payload;
}

function isFollowPagedData(
  value: FollowUserRaw[] | FollowPagedData,
): value is FollowPagedData {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    'items' in value &&
    Array.isArray(value.items)
  );
}

function normalizeFollowUser(raw: FollowUserRaw): FollowUser {
  return {
    userId: raw.id,
    nickName: raw.nickName,
    username: raw.username,
    avatarUrl: raw.avatarUrl,
    avatarPath: raw.avatarPath,
    avatar: raw.avatar,
    level: raw.level ?? null,
    identityTags: raw.identityTags ?? [],
    relation: raw.relation ?? 'none',
  };
}

function normalizeFollowUsers(list: FollowUserRaw[]): FollowUser[] {
  return list
    .map(normalizeFollowUser)
    .filter((user) => Boolean(user.userId));
}

function extractFollowUsers(
  data: FollowUserRaw[] | FollowPagedData,
): FollowUser[] {
  const list = isFollowPagedData(data) ? data.items : data;
  return normalizeFollowUsers(list);
}

/**
 * 我关注的列表 GET /follow/following
 */
export async function getFollowingList(): Promise<FollowUser[]> {
  const response = await request.get<
    FollowUserRaw[] | FollowPagedData | ApiEnvelope<FollowUserRaw[] | FollowPagedData>
  >(API_PATHS.FOLLOW_FOLLOWING);
  return extractFollowUsers(unwrapResponse(response, '获取关注列表失败'));
}

/**
 * 关注我的列表 GET /follow/followers
 */
export async function getFollowersList(): Promise<FollowUser[]> {
  const response = await request.get<
    FollowUserRaw[] | FollowPagedData | ApiEnvelope<FollowUserRaw[] | FollowPagedData>
  >(API_PATHS.FOLLOW_FOLLOWERS);
  return extractFollowUsers(unwrapResponse(response, '获取粉丝列表失败'));
}

/**
 * 关注用户 POST /follow  body: { userId }
 */
export async function followUser(userId: string): Promise<FollowActionResponse> {
  const response = await request.post<
    FollowActionResponse | ApiEnvelope<FollowActionResponse>
  >(API_PATHS.FOLLOW, { userId });
  return unwrapResponse(response, '关注失败');
}

/**
 * 取关 DELETE /follow/:userId
 */
export async function unfollowUser(userId: string): Promise<FollowActionResponse> {
  const response = await request.delete<
    FollowActionResponse | ApiEnvelope<FollowActionResponse>
  >(`${API_PATHS.FOLLOW}/${userId}`);
  return unwrapResponse(response, '取关失败');
}

/**
 * 按昵称搜索用户 GET /follow/search?nickName=
 * 响应 data: { items, total, page, pageSize }
 */
export async function searchUsersByNickName(
  nickName: string,
): Promise<FollowUser[]> {
  const response = await request.get<
    FollowPagedData | ApiEnvelope<FollowPagedData>
  >(API_PATHS.FOLLOW_SEARCH, {
    params: { nickName },
  });
  return extractFollowUsers(unwrapResponse(response, '搜索用户失败'));
}
