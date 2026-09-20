import { useCallback, useEffect, useRef, useState } from 'react';
import { Keyboard, Platform } from 'react-native';

import type { CommentComposerHandle } from '@/src/features/square/components/comments/CommentComposer';
import {
  COMMENT_COMPOSER_PLACEHOLDER,
  COMPOSER_FOCUS_DELAY_MS,
  COMPOSER_OPEN_GUARD_MS,
} from '@/src/features/square/constants';
import { useCommentActions } from '@/src/features/square/hooks/useCommentActions';
import { useComments } from '@/src/features/square/hooks/useComments';
import { useCommentsViewport } from '@/src/features/square/hooks/useCommentsViewport';
import { useRequireAuth } from '@/src/features/square/hooks/useRequireAuth';
import type { SquareComment, SquareTargetType } from '@/src/features/square/types';
import { getReplyPlaceholder } from '@/src/features/square/utils/displayAuthor';
import { useLocateFocusedComment } from '@/src/features/square/hooks/useLocateFocusedComment';
import { usePendingCommentReply } from '@/src/features/square/utils/commentFocusCue';

type InlineCommentTarget = Extract<SquareTargetType, 'story' | 'ask_answer'>;

export interface FlowerTarget {
  targetType: InlineCommentTarget | 'comment';
  targetId: string;
}

export function useStoryDetailComments(
  targetId: string,
  initialCommentCount?: number,
  targetType: InlineCommentTarget = 'story',
) {
  const comments = useComments({
    targetType,
    targetId,
    enabled: true,
  });
  const { runAction, isPending, resonateComment, collectComment } = useCommentActions();
  const requireAuth = useRequireAuth();
  const composerRef = useRef<CommentComposerHandle>(null);
  const [sheetVisible, setSheetVisible] = useState(false);
  const [composerOpen, setComposerOpen] = useState(false);
  const [replyTo, setReplyTo] = useState<SquareComment | null>(null);
  const [activeRoot, setActiveRoot] = useState<SquareComment | null>(null);
  const [flowerTarget, setFlowerTarget] = useState<FlowerTarget | null>(null);
  const [commentCount, setCommentCount] = useState<number | null>(null);
  const composerOpenedAtRef = useRef(0);

  const viewport = useCommentsViewport(comments.loadMore);

  useEffect(() => {
    if (!composerOpen) {
      return;
    }
    const timer = setTimeout(() => composerRef.current?.focus(), COMPOSER_FOCUS_DELAY_MS);
    return () => clearTimeout(timer);
  }, [composerOpen, replyTo?.id]);

  useEffect(() => {
    if (!composerOpen || Platform.OS === 'web') {
      return;
    }
    const sub = Keyboard.addListener('keyboardDidHide', () => {
      if (Date.now() - composerOpenedAtRef.current < COMPOSER_OPEN_GUARD_MS) {
        return;
      }
      setComposerOpen(false);
      setReplyTo(null);
    });
    return () => sub.remove();
  }, [composerOpen]);

  const openFlowerModal = useCallback(
    (target: FlowerTarget) => {
      if (!requireAuth()) {
        return;
      }
      setFlowerTarget(target);
    },
    [requireAuth],
  );

  const openComposer = useCallback((target: SquareComment | null) => {
    composerOpenedAtRef.current = Date.now();
    setReplyTo(target);
    setComposerOpen(true);
  }, []);

  usePendingCommentReply(comments.items, comments.isLoading, openComposer);

  const closeComposer = useCallback(() => {
    setComposerOpen(false);
    setReplyTo(null);
    Keyboard.dismiss();
  }, []);

  const openReplyPanel = useCallback((comment: SquareComment) => {
    setComposerOpen(false);
    setReplyTo(null);
    setActiveRoot(comment);
  }, []);

  useLocateFocusedComment(comments.items, comments.isLoading, openReplyPanel);

  const handleCommentIcon = useCallback(() => {
    if (viewport.isCommentsInView()) {
      openComposer(null);
      return;
    }
    setComposerOpen(false);
    setReplyTo(null);
    setSheetVisible(true);
  }, [openComposer, viewport]);

  const handleComposerSubmit = useCallback(
    async (content: string) => {
      const result = replyTo
        ? await comments.submitReply(replyTo.rootId, replyTo.id, content)
        : await comments.submitComment(content);
      if (!result) {
        return false;
      }
      setCommentCount(result.commentCount ?? comments.total + 1);
      setComposerOpen(false);
      setReplyTo(null);
      return true;
    },
    [comments, replyTo],
  );

  const handleReplyToRoot = useCallback(
    async (parentId: string, content: string) => {
      if (!activeRoot) {
        return false;
      }
      const result = await comments.submitReply(activeRoot.id, parentId, content);
      if (!result) {
        return false;
      }
      setCommentCount(result.commentCount ?? comments.total + 1);
      return true;
    },
    [activeRoot, comments],
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
    comments,
    runAction,
    isPending,
    resonateComment,
    collectComment,
    composerRef,
    sheetVisible,
    setSheetVisible,
    composerOpen,
    composerPlaceholder: replyTo
      ? getReplyPlaceholder(replyTo.author)
      : COMMENT_COMPOSER_PLACEHOLDER,
    activeRoot,
    setActiveRoot,
    flowerTarget,
    setFlowerTarget,
    openFlowerModal,
    displayCommentCount: commentCount ?? initialCommentCount ?? comments.total ?? 0,
    setCommentCount,
    openComposer,
    closeComposer,
    openReplyPanel,
    handleCommentIcon,
    handleScroll: viewport.handleScroll,
    handleScrollViewLayout: viewport.handleScrollViewLayout,
    handleCommentsLayoutY: viewport.handleCommentsLayoutY,
    getScrollOffsetY: viewport.getOffsetY,
    handleComposerSubmit,
    handleReplyToRoot,
    handleSendFlower,
  };
}
