import { create } from 'zustand';

import {
  checkAuthStatus,
  login as loginApi,
  updateUserProfile as updateUserProfileApi,
} from '@/src/features/auth/api';
import type {
  AuthStatus,
  AuthUserData,
  UpdateUserProfileRequest,
} from '@/src/features/auth/types';
import { API_SUCCESS_CODE } from '@/src/services/config';
import {
  setAccessTokenGetter,
  setUnauthorizedHandler,
} from '@/src/services/request';
import {
  clearAccessToken,
  getAccessToken,
  setAccessToken,
} from '@/src/utils/tokenStorage';
import { showErrorToast, showToast } from '@/src/utils/toast';

interface AuthState {
  accessToken: string | null;
  user: AuthUserData | null;
  status: AuthStatus;
  isLoginModalVisible: boolean;
  isSubmitting: boolean;
  isUpdatingProfile: boolean;
  bootstrap: () => Promise<void>;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (params: UpdateUserProfileRequest) => Promise<boolean>;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  handleUnauthorized: () => void;
}

function mapLoginUser(data: {
  id: string;
  points?: number;
  username?: string;
  role?: string;
  nickName?: string;
  gender?: AuthUserData['gender'];
  birthday?: string;
}): AuthUserData {
  return {
    id: data.id,
    points: data.points ?? 0,
    username: data.username ?? '',
    role: data.role ?? '',
    ttl: 0,
    nickName: data.nickName,
    gender: data.gender,
    birthday: data.birthday,
  };
}

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  user: null,
  status: 'idle',
  isLoginModalVisible: false,
  isSubmitting: false,
  isUpdatingProfile: false,

  openLoginModal: () => set({ isLoginModalVisible: true }),

  closeLoginModal: () => set({ isLoginModalVisible: false }),

  handleUnauthorized: () => {
    void clearAccessToken();
    set({
      accessToken: null,
      user: null,
      status: 'unauthenticated',
      isLoginModalVisible: true,
    });
  },

  bootstrap: async () => {
    set({ status: 'checking' });

    try {
      const token = await getAccessToken();

      if (!token) {
        set({
          accessToken: null,
          user: null,
          status: 'unauthenticated',
          isLoginModalVisible: true,
        });
        return;
      }

      set({ accessToken: token });

      const response = await checkAuthStatus();

      if (response.statusCode === API_SUCCESS_CODE && response.data) {
        set({
          user: response.data,
          status: 'authenticated',
          isLoginModalVisible: false,
        });
        return;
      }

      await clearAccessToken();
      set({
        accessToken: null,
        user: null,
        status: 'unauthenticated',
        isLoginModalVisible: true,
      });
    } catch {
      await clearAccessToken();
      set({
        accessToken: null,
        user: null,
        status: 'unauthenticated',
        isLoginModalVisible: true,
      });
    }
  },

  login: async (username: string, password: string) => {
    set({ isSubmitting: true });

    try {
      const response = await loginApi(username, password);

      if (response.statusCode !== API_SUCCESS_CODE || !response.data?.access_token) {
        showErrorToast(response.message || '登录失败，请检查账号密码');
        return false;
      }

      const { access_token: accessToken, ...userFields } = response.data;
      await setAccessToken(accessToken);

      set({
        accessToken,
        user: mapLoginUser(userFields),
        status: 'authenticated',
        isLoginModalVisible: false,
        isSubmitting: false,
      });

      return true;
    } catch {
      // 网络错误已由 request 拦截器提示
      return false;
    } finally {
      set({ isSubmitting: false });
    }
  },

  logout: async () => {
    await clearAccessToken();
    set({
      accessToken: null,
      user: null,
      status: 'unauthenticated',
      isLoginModalVisible: true,
    });
  },

  updateProfile: async (params: UpdateUserProfileRequest) => {
    const { user } = get();
    if (!user?.id) {
      showErrorToast('请先登录');
      return false;
    }

    set({ isUpdatingProfile: true });

    try {
      const response = await updateUserProfileApi(user.id, params);

      if (response.statusCode !== API_SUCCESS_CODE) {
        showErrorToast(response.message || '更新资料失败');
        return false;
      }

      set({
        user: {
          ...user,
          nickName: params.nickName,
          gender: params.gender,
          birthday: params.birthday,
        },
      });
      showToast(response.message || '资料已更新');
      return true;
    } catch {
      // 网络错误已由 request 拦截器提示
      return false;
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
}));

setAccessTokenGetter(() => useAuthStore.getState().accessToken);
setUnauthorizedHandler(() => {
  useAuthStore.getState().handleUnauthorized();
});
