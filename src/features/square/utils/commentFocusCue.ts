import { useEffect, useState } from 'react';

import type { SquareComment } from '@/src/features/square/types';

const HIGHLIGHT_DURATION_MS = 2000;

let pendingHighlightId: string | null = null;
let pendingReplyId: string | null = null;

export function armCommentFocus(next: {
  highlightId?: string;
  replyToId?: string;
}): void {
  pendingHighlightId = next.highlightId ?? null;
  pendingReplyId = next.replyToId ?? null;
}

export function useCommentHighlight(commentId: string): boolean {
  const [active, setActive] = useState(pendingHighlightId === commentId);

  useEffect(() => {
    if (pendingHighlightId !== commentId) {
      return;
    }
    setActive(true);
    const timer = setTimeout(() => {
      setActive(false);
      if (pendingHighlightId === commentId) {
        pendingHighlightId = null;
      }
    }, HIGHLIGHT_DURATION_MS);
    return () => clearTimeout(timer);
  }, [commentId]);

  return active;
}

export function usePendingCommentReply(
  items: SquareComment[],
  isLoading: boolean,
  openComposer: (comment: SquareComment) => void,
): void {
  useEffect(() => {
    if (!pendingReplyId || isLoading) {
      return;
    }
    const found = items.find((item) => item.id === pendingReplyId);
    pendingReplyId = null;
    if (found) {
      openComposer(found);
    }
  }, [isLoading, items, openComposer]);
}
