import { useQuery } from '@tanstack/react-query';

import { getMeHome } from '@/src/features/profile/api';
import { PROFILE_QUERY_KEYS } from '@/src/features/profile/constants';
import type { ProfileHomeData } from '@/src/features/profile/types';

export function useProfileHomeData(enabled: boolean): {
  home: ProfileHomeData | null;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
} {
  const query = useQuery({
    queryKey: PROFILE_QUERY_KEYS.home,
    queryFn: getMeHome,
    enabled,
  });

  return {
    home: query.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: () => {
      void query.refetch();
    },
  };
}
