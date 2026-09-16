import type { Href } from 'expo-router';

import type { ProfileCommentItem } from '@/src/features/profile/types';

type CommentSource = ProfileCommentItem['source'];

/** 根据评论来源解析详情页路径；无对应路由时返回 null */
export function resolveCommentSourceHref(source: CommentSource): Href | null {
  const targetId = source.targetId?.trim();
  if (!targetId) {
    return null;
  }
  switch (source.targetType) {
    case 'story':
      return `/stories/${targetId}`;
    case 'ask':
      return `/asks/${targetId}`;
    case 'ask_answer':
      return `/ask-answers/${targetId}`;
    default:
      return null;
  }
}
