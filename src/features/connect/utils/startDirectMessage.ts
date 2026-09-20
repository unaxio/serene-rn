import { useRouter } from 'expo-router';

import { openDmConversation } from '@/src/features/connect/api';
import { DM_PEER_UNAVAILABLE_MESSAGE } from '@/src/features/connect/constants';
import { toastCaughtFailure } from '@/src/utils/requestError';
import { showToast } from '@/src/utils/toast';

type AppRouter = ReturnType<typeof useRouter>;

export async function startDirectMessage(router: AppRouter, userId: string): Promise<void> {
  const peerId = userId.trim();
  if (!peerId) {
    showToast(DM_PEER_UNAVAILABLE_MESSAGE);
    return;
  }
  try {
    const { conversationId } = await openDmConversation(peerId);
    router.push(`/connect/dm/${conversationId}`);
  } catch (error) {
    toastCaughtFailure(error);
  }
}
