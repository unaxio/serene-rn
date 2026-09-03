import { useCallback } from 'react';

import { useAuthStore } from '@/src/store/authStore';

export function useRequireAuth(): () => boolean {
  const isAuthenticated = useAuthStore((state) => state.status === 'authenticated');
  const openLoginModal = useAuthStore((state) => state.openLoginModal);

  return useCallback(() => {
    if (isAuthenticated) {
      return true;
    }
    openLoginModal();
    return false;
  }, [isAuthenticated, openLoginModal]);
}
