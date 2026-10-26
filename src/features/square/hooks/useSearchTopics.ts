import { useQuery } from '@tanstack/react-query';

import { SEARCH_KEYWORD_MAX_LENGTH, SQUARE_QUERY_KEYS } from '@/src/features/square/constants';
import { getSearchTopics } from '@/src/features/square/topicApi';

export function useSearchTopics(keyword: string) {
  const trimmed = keyword.trim();
  const enabled = trimmed.length > 0 && trimmed.length <= SEARCH_KEYWORD_MAX_LENGTH;
  const query = useQuery({
    queryKey: SQUARE_QUERY_KEYS.searchTopics(trimmed),
    queryFn: () => getSearchTopics(trimmed),
    enabled,
  });

  return {
    topics: query.data ?? [],
    refresh: query.refetch,
  };
}
