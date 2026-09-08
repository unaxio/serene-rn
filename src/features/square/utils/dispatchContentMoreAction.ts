import type { QueryClient } from '@tanstack/react-query';
import type { useRouter } from 'expo-router';

import {
  COMING_SOON_MESSAGE,
  FOLLOW_ANONYMOUS_BLOCKED,
  NOT_INTERESTED_SUCCESS,
  SQUARE_QUERY_KEYS,
} from '@/src/features/square/constants';
import type { Share } from '@/src/features/square/types';
import { buildContentSharePath } from '@/src/features/square/utils/contentSharePath';
import { copySquareLink } from '@/src/features/square/utils/copySquareLink';
import type {
  ContentMoreActionId,
  ContentMoreKind,
} from '@/src/features/square/utils/contentMoreActions';
import { showToast } from '@/src/utils/toast';

type AppRouter = ReturnType<typeof useRouter>;

interface ContentMoreActionContext {
  contentKind: ContentMoreKind;
  targetId: string;
  authorId: string | null;
  askId: string | null;
  shareSnapshot: Share | null;
  requireAuth: () => boolean;
  queryClient: QueryClient;
  router: AppRouter;
  follow: (nextFollow: boolean) => Promise<unknown>;
  markNotInterested: () => Promise<unknown>;
  openReport: () => void;
  openDelete: () => void;
}

export function dispatchContentMoreAction(
  actionId: ContentMoreActionId,
  ctx: ContentMoreActionContext,
): void {
  if (actionId === 'share') {
    void copySquareLink(buildContentSharePath(ctx.contentKind, ctx.targetId));
    return;
  }
  if (actionId === 'promote' || actionId === 'message') {
    showToast(COMING_SOON_MESSAGE);
    return;
  }
  if (actionId === 'follow' || actionId === 'unfollow') {
    if (!ctx.requireAuth()) {
      return;
    }
    if (!ctx.authorId) {
      showToast(FOLLOW_ANONYMOUS_BLOCKED);
      return;
    }
    void ctx.follow(actionId === 'follow').catch(() => undefined);
    return;
  }
  if (actionId === 'report') {
    if (ctx.requireAuth()) {
      ctx.openReport();
    }
    return;
  }
  if (actionId === 'notInterested') {
    if (!ctx.requireAuth()) {
      return;
    }
    void ctx
      .markNotInterested()
      .then(() => {
        showToast(NOT_INTERESTED_SUCCESS);
      })
      .catch(() => undefined);
    return;
  }
  if (actionId === 'edit') {
    openContentEdit(ctx);
    return;
  }
  if (actionId === 'delete') {
    ctx.openDelete();
  }
}

function openContentEdit(ctx: ContentMoreActionContext): void {
  if (ctx.contentKind === 'share' && ctx.shareSnapshot) {
    ctx.queryClient.setQueryData(
      SQUARE_QUERY_KEYS.shareDetail(ctx.targetId),
      ctx.shareSnapshot,
    );
  }
  if (ctx.contentKind === 'story') {
    ctx.router.push(`/publish/story?editId=${ctx.targetId}`);
    return;
  }
  if (ctx.contentKind === 'share') {
    ctx.router.push(`/publish/share?editId=${ctx.targetId}`);
    return;
  }
  if (ctx.contentKind === 'ask') {
    ctx.router.push(`/publish/ask?editId=${ctx.targetId}`);
    return;
  }
  if (!ctx.askId) {
    showToast(COMING_SOON_MESSAGE);
    return;
  }
  ctx.router.push(`/asks/${ctx.askId}/answer?editId=${ctx.targetId}`);
}
