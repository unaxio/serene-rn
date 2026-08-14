import { useQuery } from '@tanstack/react-query';

import { getFlowerCardAnswers } from '@/src/features/soulFlower/api';
import { SOUL_FLOWER_QUERY_KEYS } from '@/src/features/soulFlower/constants';

export function useFlowerCardAnswers(flowerId: string | undefined) {
  const query = useQuery({
    queryKey: SOUL_FLOWER_QUERY_KEYS.flowerCardAnswers(flowerId ?? ''),
    queryFn: () => getFlowerCardAnswers(flowerId ?? ''),
    enabled: Boolean(flowerId),
  });

  return {
    records: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
}
