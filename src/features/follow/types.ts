/** 关注相关用户信息（列表 / 搜索共用） */
export interface FollowUser {
  userId: string;
  nickName?: string;
  username?: string;
  avatarUrl?: string;
  avatarPath?: string;
  avatar?: string;
}

export interface FollowActionResponse {
  success: boolean;
  message?: string;
}
