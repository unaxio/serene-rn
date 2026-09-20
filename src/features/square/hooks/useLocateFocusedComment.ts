import { useEffect, useRef } from 'react';

import type { SquareComment } from '@/src/features/square/types';
import { clearThreadRootId, peekCommentHighlightId, peekThreadRootId } from '@/src/features/square/utils/commentFocusCue';

export function useLocateFocusedComment(
  items: SquareComment[],
  isLoading: boolean,
  openReplyPanel: (comment: SquareComment) => void,
): void {
  const openedRef = useRef(false);

  useEffect(() => {
    if (isLoading || openedRef.current) {
      return;
    }
    const threadRootId = peekThreadRootId();
    const highlightId = peekCommentHighlightId();
    if (!threadRootId || !highlightId || threadRootId === highlightId) {
      return;
    }
    const root = items.find((item) => item.id === threadRootId);
    if (!root) {
      return;
    }
    openedRef.current = true;
    clearThreadRootId();
    openReplyPanel(root);
  }, [isLoading, items, openReplyPanel]);
}
