import { useQuery } from '@tanstack/react-query';

import { getConnectUnread } from '@/src/features/connect/api';
import { CONNECT_QUERY_KEYS } from '@/src/features/connect/constants';
import { useAuthStore } from '@/src/store/authStore';

export function useConnectUnreadCount(): number {
  const isAuthenticated = useAuthStore((state) => state.status === 'authenticated');
  const query = useQuery({
    queryKey: CONNECT_QUERY_KEYS.unread,
    queryFn: getConnectUnread,
    enabled: isAuthenticated,
    staleTime: 0,
  });
  return query.data?.total ?? 0;
}
