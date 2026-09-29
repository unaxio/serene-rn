export type UserGender = 'male' | 'female' | 'other' | 'secret';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginData {
  id: string;
  points?: number;
  username?: string;
  role?: string;
  access_token: string;
  nickName?: string;
  gender?: UserGender;
  birthday?: string;
}

export interface LoginResponse {
  statusCode: number;
  message: string;
  data?: LoginData;
}

export interface AuthUserData {
  id: string;
  points: number;
  username: string;
  role: string;
  ttl: number;
  nickName?: string;
  gender?: UserGender;
  birthday?: string;
  bio?: string;
  avatarUrl?: string;
  region?: string | null;
  cityCode?: string | null;
  relationshipStatus?: string | null;
}

export interface AuthStatusResponse {
  statusCode: number;
  message: string;
  data?: AuthUserData;
}

/** 更新用户信息 POST /users/:userId */
export interface UpdateUserProfileRequest {
  nickName: string;
  gender: UserGender;
  birthday: string;
  bio?: string;
  avatarPath?: string;
  region?: string | null;
  relationshipStatus?: string | null;
}

export interface UpdateUserProfileResponse {
  statusCode: number;
  message: string;
}

export type AuthStatus = 'idle' | 'checking' | 'authenticated' | 'unauthenticated';
