import { useQuery } from '@tanstack/react-query';

import { SQUARE_QUERY_KEYS } from '@/src/features/square/constants';
import { getGiftFlowerCatalog } from '@/src/features/square/giftFlowerApi';

export function useGiftFlowerCatalog(enabled: boolean) {
  const query = useQuery({
    queryKey: SQUARE_QUERY_KEYS.giftFlowerCatalog,
    queryFn: getGiftFlowerCatalog,
    enabled,
  });

  return {
    items: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
}
