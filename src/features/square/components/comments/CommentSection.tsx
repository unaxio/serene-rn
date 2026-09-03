import { useCallback, useRef, useState } from 'react';

import { FullScreenModal } from '@/src/components/FullScreenModal';
import type { CommentComposerHandle } from '@/src/features/square/components/comments/CommentComposer';
import { CommentList } from '@/src/features/square/components/comments/CommentList';
import { CommentReplyPanel } from '@/src/features/square/components/comments/CommentReplyPanel';
import { COMPOSER_FOCUS_DELAY_MS } from '@/src/features/square/constants';
import { useCommentActions } from '@/src/features/square/hooks/useCommentActions';
import { useComments } from '@/src/features/square/hooks/useComments';
import type { SquareComment, SquareTargetType } from '@/src/features/square/types';

interface CommentSectionProps {
  visible: boolean;
  onClose: () => void;
  targetType: SquareTargetType;
  targetId: string;
  onCommentCountChange?: (newCount: number) => void;
  enableCollect?: boolean;
  enableFlower?: boolean;
  onFlower?: (comment: SquareComment) => void;
}

export function CommentSection({
  visible,
  onClose,
  targetType,
  targetId,
  onCommentCountChange,
  enableCollect = false,
  enableFlower = false,
  onFlower,
}: CommentSectionProps) {
  const [activeRoot, setActiveRoot] = useState<SquareComment | null>(null);
  const [replyTo, setReplyTo] = useState<SquareComment | null>(null);
  const composerRef = useRef<CommentComposerHandle>(null);
  const comments = useComments({ targetType, targetId, enabled: visible });
  const { resonateComment, collectComment } = useCommentActions();

  const notifyCount = useCallback(
    (nextCount?: number) => {
      onCommentCountChange?.(nextCount ?? comments.total + 1);
    },
    [comments.total, onCommentCountChange],
  );

  const handleSubmit = useCallback(
    async (content: string) => {
      const result = replyTo
        ? await comments.submitReply(replyTo.rootId, replyTo.id, content)
        : await comments.submitComment(content);
      if (!result) {
        return false;
      }
      notifyCount(result.commentCount);
      setReplyTo(null);
      return true;
    },
    [comments, notifyCount, replyTo],
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
      notifyCount(result.commentCount);
      return true;
    },
    [activeRoot, comments, notifyCount],
  );

  const handleReply = useCallback((comment: SquareComment) => {
    setReplyTo(comment);
    setTimeout(() => composerRef.current?.focus(), COMPOSER_FOCUS_DELAY_MS);
  }, []);

  return (
    <FullScreenModal
      visible={visible}
      title="全部评论"
      onBack={() => {
        setActiveRoot(null);
        setReplyTo(null);
        onClose();
      }}>
      <CommentList
        comments={comments}
        enableCollect={enableCollect}
        enableFlower={enableFlower}
        replyTo={replyTo}
        composerRef={composerRef}
        onCreate={handleSubmit}
        onReply={handleReply}
        onViewReplies={setActiveRoot}
        onResonate={resonateComment}
        onCollect={collectComment}
        onFlower={onFlower}
      />
      {activeRoot ? (
        <CommentReplyPanel
          visible
          root={activeRoot}
          isSubmitting={comments.isSubmitting}
          enableCollect={enableCollect}
          enableFlower={enableFlower}
          onClose={() => setActiveRoot(null)}
          onResonate={resonateComment}
          onCollect={collectComment}
          onFlower={onFlower}
          onSubmitReply={handleReplyToRoot}
        />
      ) : null}
    </FullScreenModal>
  );
}
