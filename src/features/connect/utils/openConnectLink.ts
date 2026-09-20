import { useRouter } from 'expo-router';

import {
  CONNECT_COMING_SOON_MESSAGE,
  CONNECT_UNAVAILABLE_MESSAGE,
} from '@/src/features/connect/constants';
import type { ConnectLink } from '@/src/features/connect/types';
import { armCommentFocus } from '@/src/features/square/utils/commentFocusCue';
import { showToast } from '@/src/utils/toast';

type AppRouter = ReturnType<typeof useRouter>;

function pushRoot(router: AppRouter, rootType: string | undefined, rootId: string | undefined): boolean {
  if (!rootId) {
    return false;
  }
  if (rootType === 'story') {
    router.push(`/stories/${rootId}`);
    return true;
  }
  if (rootType === 'ask') {
    router.push(`/asks/${rootId}`);
    return true;
  }
  if (rootType === 'ask_answer') {
    router.push(`/ask-answers/${rootId}`);
    return true;
  }
  return false;
}

export function openConnectLink(
  router: AppRouter,
  link: ConnectLink | null,
  replyToId?: string,
): void {
  if (!link?.id) {
    showToast(CONNECT_UNAVAILABLE_MESSAGE);
    return;
  }

  const highlightId = link.highlightId ?? (link.type === 'comment' ? link.id : undefined);
  armCommentFocus({ highlightId, replyToId });

  if (link.type === 'story') {
    router.push(`/stories/${link.id}`);
    return;
  }
  if (link.type === 'ask') {
    router.push(`/asks/${link.id}`);
    return;
  }
  if (link.type === 'ask_answer') {
    router.push(`/ask-answers/${link.id}`);
    return;
  }
  if (link.type === 'user') {
    router.push(`/users/${link.id}`);
    return;
  }
  if (link.type === 'system') {
    router.push(`/connect/system/${link.id}`);
    return;
  }
  if (link.type === 'comment') {
    if (pushRoot(router, link.rootType, link.rootId)) {
      return;
    }
    showToast(CONNECT_UNAVAILABLE_MESSAGE);
    return;
  }
  showToast(CONNECT_COMING_SOON_MESSAGE);
}
