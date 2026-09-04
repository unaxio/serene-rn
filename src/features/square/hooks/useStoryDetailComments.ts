import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Keyboard,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';

import type { CommentComposerHandle } from '@/src/features/square/components/comments/CommentComposer';
import {
  COMMENT_COMPOSER_PLACEHOLDER,
  COMMENT_LOAD_MORE_OFFSET,
  COMMENTS_SCROLLED_SLACK,
  COMPOSER_FOCUS_DELAY_MS,
  COMPOSER_OPEN_GUARD_MS,
} from '@/src/features/square/constants';
import { useCommentActions } from '@/src/features/square/hooks/useCommentActions';
import { useComments } from '@/src/features/square/hooks/useComments';
import { useRequireAuth } from '@/src/features/square/hooks/useRequireAuth';
import type { SquareComment } from '@/src/features/square/types';
import { getReplyPlaceholder } from '@/src/features/square/utils/displayAuthor';

export interface FlowerTarget {
  targetType: 'story' | 'comment';
  targetId: string;
}

export function useStoryDetailComments(storyId: string, storyCommentCount?: number) {
  const comments = useComments({
    targetType: 'story',
    targetId: storyId,
    enabled: true,
  });
  const { runAction, isPending, resonateComment, collectComment } = useCommentActions();
  const requireAuth = useRequireAuth();
  const composerRef = useRef<CommentComposerHandle>(null);
  const commentsYRef = useRef(0);
  const isCommentsInViewRef = useRef(false);
  const [sheetVisible, setSheetVisible] = useState(false);
  const [composerOpen, setComposerOpen] = useState(false);
  const [replyTo, setReplyTo] = useState<SquareComment | null>(null);
  const [activeRoot, setActiveRoot] = useState<SquareComment | null>(null);
  const [flowerTarget, setFlowerTarget] = useState<FlowerTarget | null>(null);
  const [commentCount, setCommentCount] = useState<number | null>(null);

  const composerOpenedAtRef = useRef(0);

  useEffect(() => {
    if (!composerOpen) {
      return;
    }
    const timer = setTimeout(() => composerRef.current?.focus(), COMPOSER_FOCUS_DELAY_MS);
    return () => clearTimeout(timer);
  }, [composerOpen, replyTo?.id]);

  useEffect(() => {
    if (!composerOpen) {
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

  const openReplyPanel = useCallback((comment: SquareComment) => {
    setComposerOpen(false);
    setReplyTo(null);
    setActiveRoot(comment);
  }, []);

  const handleCommentIcon = useCallback(() => {
    if (isCommentsInViewRef.current) {
      openComposer(null);
      return;
    }
    setComposerOpen(false);
    setSheetVisible(true);
  }, [openComposer]);

  const loadMore = comments.loadMore;

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const { contentOffset, layoutMeasurement, contentSize } = event.nativeEvent;
      isCommentsInViewRef.current =
        contentOffset.y >= commentsYRef.current - COMMENTS_SCROLLED_SLACK;
      if (contentOffset.y + layoutMeasurement.height >= contentSize.height - COMMENT_LOAD_MORE_OFFSET) {
        loadMore();
      }
    },
    [loadMore],
  );

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
    commentsYRef,
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
    displayCommentCount: commentCount ?? storyCommentCount ?? comments.total ?? 0,
    setCommentCount,
    openComposer,
    openReplyPanel,
    handleCommentIcon,
    handleScroll,
    handleComposerSubmit,
    handleReplyToRoot,
    handleSendFlower,
  };
}
