/** 当前用户与对方的关注关系 */
export type FollowRelation = 'none' | 'following' | 'followed_by' | 'mutual';

/** 关注相关用户信息（列表 / 搜索共用） */
export interface FollowUser {
  userId: string;
  nickName?: string;
  username?: string;
  avatarUrl?: string;
  avatarPath?: string;
  avatar?: string;
  level?: string | number | null;
  identityTags?: string[];
  relation?: FollowRelation;
}

/** 后端原始用户字段 */
export interface FollowUserRaw {
  id: string;
  nickName?: string;
  username?: string;
  avatarUrl?: string;
  avatarPath?: string;
  avatar?: string;
  level?: string | number | null;
  identityTags?: string[];
  relation?: FollowRelation;
}

/** 关注列表 / 搜索分页结构 */
export interface FollowPagedData {
  items: FollowUserRaw[];
  total: number;
  page: number;
  pageSize: number;
}

export interface FollowActionResponse {
  success: boolean;
  message?: string;
}
