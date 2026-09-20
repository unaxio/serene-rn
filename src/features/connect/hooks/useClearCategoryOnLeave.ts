import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';

import { clearConnectNotifications } from '@/src/features/connect/api';
import { CONNECT_QUERY_KEYS } from '@/src/features/connect/constants';
import type { ConnectNotificationCategory } from '@/src/features/connect/types';
import { toastCaughtFailure } from '@/src/utils/requestError';
import { useAuthStore } from '@/src/store/authStore';

export function useClearCategoryOnLeave(category: ConnectNotificationCategory): void {
  const queryClient = useQueryClient();
  const isAuthenticated = useAuthStore((state) => state.status === 'authenticated');
  const beforeRef = useRef(new Date().toISOString());

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }
    const before = beforeRef.current;
    return () => {
      void clearConnectNotifications(category, before)
        .then(() =>
          Promise.all([
            queryClient.invalidateQueries({ queryKey: CONNECT_QUERY_KEYS.home }),
            queryClient.invalidateQueries({ queryKey: CONNECT_QUERY_KEYS.unread }),
          ]),
        )
        .catch((error: unknown) => {
          toastCaughtFailure(error);
        });
    };
  }, [category, isAuthenticated, queryClient]);
}
