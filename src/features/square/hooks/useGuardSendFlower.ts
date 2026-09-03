import { useCallback } from 'react';

import { SEND_FLOWER_TO_SELF_MESSAGE } from '@/src/features/square/constants';
import { isOwnSquareAuthor } from '@/src/features/square/utils/isOwnSquareAuthor';
import { useAuthStore } from '@/src/store/authStore';
import { showToast } from '@/src/utils/toast';

export function useGuardSendFlower() {
  const currentUserId = useAuthStore((state) => state.user?.id ?? null);

  return useCallback(
    (authorId: string | null | undefined) => {
      if (isOwnSquareAuthor(authorId, currentUserId)) {
        showToast(SEND_FLOWER_TO_SELF_MESSAGE);
        return false;
      }
      return true;
    },
    [currentUserId],
  );
}
