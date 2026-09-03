import { useQuery } from '@tanstack/react-query';

import { getAskDetail } from '@/src/features/square/askApi';
import { SQUARE_QUERY_KEYS } from '@/src/features/square/constants';

export function useAskDetail(askId: string) {
  const query = useQuery({
    queryKey: SQUARE_QUERY_KEYS.askDetail(askId),
    queryFn: () => getAskDetail(askId),
    enabled: askId.length > 0,
  });

  return {
    ask: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
}
