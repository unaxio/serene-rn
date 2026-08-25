import { API_PATHS, API_SUCCESS_CODE } from '@/src/services/config';
import { request } from '@/src/services/request';

import type { FollowActionResponse, FollowUser } from './types';

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

/** 兼容后端 id / userId 字段 */
function normalizeFollowUser(raw: FollowUser & { id?: string }): FollowUser {
  return {
    userId: raw.userId || raw.id || '',
    nickName: raw.nickName,
    username: raw.username,
    avatarUrl: raw.avatarUrl,
    avatarPath: raw.avatarPath,
    avatar: raw.avatar,
  };
}

function normalizeFollowUsers(
  list: Array<FollowUser & { id?: string }>,
): FollowUser[] {
  return list
    .map(normalizeFollowUser)
    .filter((user) => Boolean(user.userId));
}

/**
 * 我关注的列表 GET /follow/following
 */
export async function getFollowingList(): Promise<FollowUser[]> {
  const response = await request.get<
    Array<FollowUser & { id?: string }> | ApiEnvelope<Array<FollowUser & { id?: string }>>
  >(API_PATHS.FOLLOW_FOLLOWING);
  return normalizeFollowUsers(unwrapResponse(response, '获取关注列表失败'));
}

/**
 * 关注我的列表 GET /follow/followers
 */
export async function getFollowersList(): Promise<FollowUser[]> {
  const response = await request.get<
    Array<FollowUser & { id?: string }> | ApiEnvelope<Array<FollowUser & { id?: string }>>
  >(API_PATHS.FOLLOW_FOLLOWERS);
  return normalizeFollowUsers(unwrapResponse(response, '获取粉丝列表失败'));
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
 */
export async function searchUsersByNickName(
  nickName: string,
): Promise<FollowUser[]> {
  const response = await request.get<
    Array<FollowUser & { id?: string }> | ApiEnvelope<Array<FollowUser & { id?: string }>>
  >(API_PATHS.FOLLOW_SEARCH, {
    params: { nickName },
  });
  return normalizeFollowUsers(unwrapResponse(response, '搜索用户失败'));
}
