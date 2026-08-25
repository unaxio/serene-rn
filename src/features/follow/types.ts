/** 关注相关用户信息（列表 / 搜索共用） */
export interface FollowUser {
  userId: string;
  nickName?: string;
  username?: string;
  avatarUrl?: string;
  avatarPath?: string;
  avatar?: string;
}

/** 后端原始用户字段 */
export interface FollowUserRaw {
  id: string;
  nickName?: string;
  username?: string;
  avatarUrl?: string;
  avatarPath?: string;
  avatar?: string;
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
