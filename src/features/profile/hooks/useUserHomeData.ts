import { useQuery } from '@tanstack/react-query';

import { getUserHome } from '@/src/features/profile/api';
import { PROFILE_QUERY_KEYS } from '@/src/features/profile/constants';

export function useUserHomeData(userId: string) {
  return useQuery({
    queryKey: PROFILE_QUERY_KEYS.userHome(userId),
    queryFn: () => getUserHome(userId),
    enabled: userId.length > 0,
  });
}
