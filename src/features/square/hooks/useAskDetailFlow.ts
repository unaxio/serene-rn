import { useCallback, useState } from 'react';
import { type NativeScrollEvent, type NativeSyntheticEvent } from 'react-native';

import { ASK_STICKY_SLACK } from '@/src/features/square/constants';
import { useCommentActions } from '@/src/features/square/hooks/useCommentActions';
import { useRequireAuth } from '@/src/features/square/hooks/useRequireAuth';

export interface AskFlowerTarget {
  targetType: 'ask' | 'ask_answer' | 'comment';
  targetId: string;
}

export function useAskDetailFlow() {
  const requireAuth = useRequireAuth();
  const { runAction, isPending } = useCommentActions();
  const [questionHeight, setQuestionHeight] = useState(0);
  const [stickyVisible, setStickyVisible] = useState(false);
  const [inviteVisible, setInviteVisible] = useState(false);
  const [flowerTarget, setFlowerTarget] = useState<AskFlowerTarget | null>(null);

  const openFlower = useCallback(
    (target: AskFlowerTarget) => {
      if (!requireAuth()) {
        return;
      }
      setFlowerTarget(target);
    },
    [requireAuth],
  );

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const y = event.nativeEvent.contentOffset.y;
      setStickyVisible(questionHeight > 0 && y >= questionHeight - ASK_STICKY_SLACK);
    },
    [questionHeight],
  );

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
    questionHeight,
    setQuestionHeight,
    stickyVisible,
    handleScroll,
    inviteVisible,
    setInviteVisible,
    flowerTarget,
    setFlowerTarget,
    openFlower,
    handleSendFlower,
  };
}
