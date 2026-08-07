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
  gender?: 'male' | 'female' | 'other' | 'secret';
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
  gender?: 'male' | 'female' | 'other' | 'secret';
  birthday?: string;
}

export interface AuthStatusResponse {
  statusCode: number;
  message: string;
  data?: AuthUserData;
}

export type AuthStatus = 'idle' | 'checking' | 'authenticated' | 'unauthenticated';
