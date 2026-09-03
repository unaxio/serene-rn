import { useCallback } from 'react';

import { useSquareAction } from '@/src/features/square/hooks/useSquareAction';
import type { SquareComment } from '@/src/features/square/types';

export function useCommentActions() {
  const { runAction, isPending } = useSquareAction();

  const resonateComment = useCallback(
    (comment: SquareComment) => {
      void runAction({
        targetType: 'comment',
        targetId: comment.id,
        actionType: 'resonate',
      });
    },
    [runAction],
  );

  const collectComment = useCallback(
    (comment: SquareComment) => {
      void runAction({
        targetType: 'comment',
        targetId: comment.id,
        actionType: 'collect',
      });
    },
    [runAction],
  );

  return { runAction, isPending, resonateComment, collectComment };
}
