import { useQuery } from '@tanstack/react-query';

import { getCommentReplies } from '@/src/features/square/api';
import { SQUARE_QUERY_KEYS } from '@/src/features/square/constants';

export function useCommentReplies(rootId: string, enabled: boolean) {
  const query = useQuery({
    queryKey: SQUARE_QUERY_KEYS.commentReplies(rootId),
    queryFn: () => getCommentReplies(rootId),
    enabled: enabled && rootId.length > 0,
  });

  return {
    replies: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
}
