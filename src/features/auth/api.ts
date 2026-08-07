import { API_PATHS } from '@/src/services/config';
import { request } from '@/src/services/request';

import type { AuthStatusResponse, LoginResponse } from './types';

/**
 * 用户登录 POST /auth/login
 */
export async function login(username: string, password: string): Promise<LoginResponse> {
  return request.post<LoginResponse>(API_PATHS.AUTH_LOGIN, { username, password });
}

/**
 * 检查用户状态 GET /auth/status
 */
export async function checkAuthStatus(): Promise<AuthStatusResponse> {
  return request.get<AuthStatusResponse>(API_PATHS.AUTH_STATUS);
}
