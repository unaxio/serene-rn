import type { ContentMoreKind } from '@/src/features/square/utils/contentMoreActions';

export function buildContentSharePath(
  contentKind: ContentMoreKind,
  targetId: string,
): string {
  switch (contentKind) {
    case 'story':
      return `/stories/${targetId}`;
    case 'share':
      return `/shares/${targetId}`;
    case 'ask':
      return `/asks/${targetId}`;
    case 'ask_answer':
      return `/ask-answers/${targetId}`;
  }
}
