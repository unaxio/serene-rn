import { useQuery } from '@tanstack/react-query';

import { getAskAnswerDetail } from '@/src/features/square/askApi';
import { SQUARE_QUERY_KEYS } from '@/src/features/square/constants';

export function useAskAnswerDetail(answerId: string) {
  const query = useQuery({
    queryKey: SQUARE_QUERY_KEYS.askAnswerDetail(answerId),
    queryFn: () => getAskAnswerDetail(answerId),
    enabled: answerId.length > 0,
  });

  return {
    detail: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
}
