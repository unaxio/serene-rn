import { useCallback, useState } from 'react';
import { type NativeScrollEvent, type NativeSyntheticEvent } from 'react-native';

import { ASK_STICKY_SLACK } from '@/src/features/square/constants';
import { useCommentActions } from '@/src/features/square/hooks/useCommentActions';
import { useGuardSendFlower } from '@/src/features/square/hooks/useGuardSendFlower';
import { useRequireAuth } from '@/src/features/square/hooks/useRequireAuth';
import type { AskAnswer, SquareComment } from '@/src/features/square/types';

export interface AskFlowerTarget {
  targetType: 'ask_answer' | 'comment';
  targetId: string;
}

interface CommentSheetState {
  answerId: string;
  replyTo: SquareComment | null;
  root: SquareComment | null;
}

export function useAskDetailFlow() {
  const requireAuth = useRequireAuth();
  const canSendFlower = useGuardSendFlower();
  const { runAction, isPending, resonateComment } = useCommentActions();
  const [questionHeight, setQuestionHeight] = useState(0);
  const [stickyVisible, setStickyVisible] = useState(false);
  const [inviteVisible, setInviteVisible] = useState(false);
  const [flowerTarget, setFlowerTarget] = useState<AskFlowerTarget | null>(null);
  const [commentSheet, setCommentSheet] = useState<CommentSheetState | null>(null);

  const openFlower = useCallback(
    (target: AskFlowerTarget, authorId?: string | null) => {
      if (!requireAuth()) {
        return;
      }
      if (!canSendFlower(authorId)) {
        return;
      }
      setFlowerTarget(target);
    },
    [canSendFlower, requireAuth],
  );

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const y = event.nativeEvent.contentOffset.y;
      setStickyVisible(questionHeight > 0 && y >= questionHeight - ASK_STICKY_SLACK);
    },
    [questionHeight],
  );

  const openComments = useCallback((answer: AskAnswer, replyTo: SquareComment | null = null) => {
    setCommentSheet({ answerId: answer.id, replyTo, root: null });
  }, []);

  const openReplyPanel = useCallback((answer: AskAnswer, root: SquareComment) => {
    setCommentSheet({ answerId: answer.id, replyTo: null, root });
  }, []);

  const handleSendFlower = useCallback(
    async (giftFlowerId: string, quantity: number) => {
      if (!flowerTarget) {
        return false;
      }
      const result = await runAction({
        targetType: flowerTarget.targetType,
        targetId: flowerTarget.targetId,
        actionType: 'flower',
        giftFlowerId,
        quantity,
      });
      return result !== null;
    },
    [flowerTarget, runAction],
  );

  return {
    runAction,
    isPending,
    resonateComment,
    questionHeight,
    setQuestionHeight,
    stickyVisible,
    handleScroll,
    inviteVisible,
    setInviteVisible,
    flowerTarget,
    setFlowerTarget,
    openFlower,
    commentSheet,
    setCommentSheet,
    openComments,
    openReplyPanel,
    handleSendFlower,
  };
}
