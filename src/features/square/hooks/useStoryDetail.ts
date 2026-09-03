import { useQuery } from '@tanstack/react-query';

import { getStoryDetail } from '@/src/features/square/api';
import { SQUARE_QUERY_KEYS } from '@/src/features/square/constants';

export function useStoryDetail(storyId: string) {
  const query = useQuery({
    queryKey: SQUARE_QUERY_KEYS.storyDetail(storyId),
    queryFn: () => getStoryDetail(storyId),
    enabled: storyId.length > 0,
  });

  return {
    story: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
}
