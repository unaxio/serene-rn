import { useRouter } from 'expo-router';

import { CONNECT_UNAVAILABLE_MESSAGE } from '@/src/features/connect/constants';
import type { ConnectLink } from '@/src/features/connect/types';
import { openContentAnchor } from '@/src/features/square/utils/contentAnchor';
import { showToast } from '@/src/utils/toast';

type AppRouter = ReturnType<typeof useRouter>;

export function openConnectLink(
  router: AppRouter,
  link: ConnectLink | null,
  replyToId?: string,
): void {
  if (!link?.id) {
    showToast(CONNECT_UNAVAILABLE_MESSAGE);
    return;
  }
  if (link.type === 'system') {
    router.push(`/connect/system/${link.id}`);
    return;
  }
  if (link.type === 'dm') {
    router.push(`/connect/dm/${link.id}`);
    return;
  }
  openContentAnchor(
    router,
    {
      targetType: link.type,
      targetId: link.id,
      rootType: link.rootType,
      rootId: link.rootId,
      highlightId: link.highlightId ?? (link.type === 'comment' ? link.id : undefined),
      threadRootId: link.threadRootId,
    },
    { replyToId },
  );
}
