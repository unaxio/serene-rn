import { useQuery } from '@tanstack/react-query';

import { SQUARE_QUERY_KEYS } from '@/src/features/square/constants';
import { getGiftFlowerInventory } from '@/src/features/square/giftFlowerApi';

export function useGiftFlowerInventory(enabled: boolean) {
  const query = useQuery({
    queryKey: SQUARE_QUERY_KEYS.giftFlowerInventory,
    queryFn: getGiftFlowerInventory,
    enabled,
  });

  return {
    flowerCoin: query.data?.flowerCoin ?? 0,
    items: query.data?.items ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
}
