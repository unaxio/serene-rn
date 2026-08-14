import { useRouter } from 'expo-router';
import { useCallback } from 'react';

export function useOpenFlowerCard() {
  const router = useRouter();

  return useCallback(
    (flowerId: string) => {
      router.push(`/flower-card/${flowerId}`);
    },
    [router],
  );
}
