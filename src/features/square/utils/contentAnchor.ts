import { useRouter } from 'expo-router';

import { COMING_SOON_MESSAGE } from '@/src/features/square/constants';
import { armCommentFocus } from '@/src/features/square/utils/commentFocusCue';
import { showToast } from '@/src/utils/toast';

export const CONTENT_UNAVAILABLE_MESSAGE = '该内容暂不可查看';

export const CONTENT_ORIGIN_LABEL = '原内容';

export const CONTENT_PARENT_LABEL = '原评论';

/** 评论、送花、收藏、连接通知共用的跳转锚点 */
export interface ContentAnchor {
  targetType: string;
  targetId: string;
  titleOrSummary?: string | null;
  parentSummary?: string | null;
  /** 被回复评论的作者昵称，用于「回复了某某人的评论」 */
  parentAuthorNickName?: string | null;
  rootType?: string | null;
  rootId?: string | null;
  highlightId?: string | null;
  /** 楼中楼时的一级评论 id；与 highlightId 不同才展开回复 */
  threadRootId?: string | null;
}

type AppRouter = ReturnType<typeof useRouter>;

type PushResult = 'pushed' | 'soon' | 'miss';

interface OpenContentAnchorOptions {
  highlightId?: string;
  replyToId?: string;
}

function pushContentPage(
  router: AppRouter,
  type: string | null | undefined,
  id: string | null | undefined,
): PushResult {
  const pageId = id?.trim() ?? '';
  const pageType = type?.trim() ?? '';
  if (!pageId || !pageType) {
    return 'miss';
  }
  if (pageType === 'story') {
    router.push(`/stories/${pageId}`);
    return 'pushed';
  }
  if (pageType === 'ask') {
    router.push(`/asks/${pageId}`);
    return 'pushed';
  }
  if (pageType === 'ask_answer') {
    router.push(`/ask-answers/${pageId}`);
    return 'pushed';
  }
  if (pageType === 'user') {
    router.push(`/users/${pageId}`);
    return 'pushed';
  }
  if (pageType === 'share' || pageType === 'topic') {
    return 'soon';
  }
  return 'miss';
}

export function openContentAnchor(
  router: AppRouter,
  anchor: ContentAnchor | null | undefined,
  options?: OpenContentAnchorOptions,
): void {
  const targetId = anchor?.targetId?.trim() ?? '';
  const rootId = anchor?.rootId?.trim() ?? '';
  if (!anchor || (!targetId && !rootId)) {
    showToast(CONTENT_UNAVAILABLE_MESSAGE);
    return;
  }

  const highlightId =
    options?.highlightId?.trim() ||
    anchor.highlightId?.trim() ||
    (anchor.targetType === 'comment' ? targetId : '');

  armCommentFocus({
    highlightId: highlightId || undefined,
    replyToId: options?.replyToId,
    threadRootId: anchor.threadRootId?.trim() || undefined,
  });

  const rooted =
    rootId && anchor.rootType?.trim()
      ? pushContentPage(router, anchor.rootType, rootId)
      : 'miss';
  const result = rooted === 'miss' ? pushContentPage(router, anchor.targetType, targetId) : rooted;
  if (result === 'pushed') {
    return;
  }
  armCommentFocus({});
  showToast(result === 'soon' ? COMING_SOON_MESSAGE : CONTENT_UNAVAILABLE_MESSAGE);
}
