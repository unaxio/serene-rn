import { useCallback, useState } from 'react';

import { FullScreenModal } from '@/src/components/FullScreenModal';
import { CommentList } from '@/src/features/square/components/comments/CommentList';
import { CommentReplyPanel } from '@/src/features/square/components/comments/CommentReplyPanel';
import { useComments } from '@/src/features/square/hooks/useComments';
import { useSquareAction } from '@/src/features/square/hooks/useSquareAction';
import type { SquareComment, SquareTargetType } from '@/src/features/square/types';

interface CommentSectionProps {
  visible: boolean;
  onClose: () => void;
  targetType: SquareTargetType;
  targetId: string;
  onCommentCountChange?: (newCount: number) => void;
  enableCollect?: boolean;
}

export function CommentSection({
  visible,
  onClose,
  targetType,
  targetId,
  onCommentCountChange,
  enableCollect = false,
}: CommentSectionProps) {
  const [activeRoot, setActiveRoot] = useState<SquareComment | null>(null);
  const comments = useComments({ targetType, targetId, enabled: visible });
  const { runAction } = useSquareAction();

  const notifyCount = useCallback(
    (nextCount?: number) => {
      onCommentCountChange?.(nextCount ?? comments.total + 1);
    },
    [comments.total, onCommentCountChange],
  );

  const handleCreate = useCallback(
    async (content: string) => {
      const result = await comments.submitComment(content);
      if (!result) {
        return false;
      }
      notifyCount(result.commentCount);
      return true;
    },
    [comments, notifyCount],
  );

  const handleReply = useCallback(
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

  const handleResonate = useCallback(
    (comment: SquareComment) => {
      void runAction({
        targetType: 'comment',
        targetId: comment.id,
        actionType: 'resonate',
      });
    },
    [runAction],
  );

  const handleCollect = useCallback(
    (comment: SquareComment) => {
      void runAction({
        targetType: 'comment',
        targetId: comment.id,
        actionType: 'collect',
      });
    },
    [runAction],
  );

  return (
    <FullScreenModal
      visible={visible}
      title="全部评论"
      onBack={() => {
        setActiveRoot(null);
        onClose();
      }}>
      <CommentList
        comments={comments}
        enableCollect={enableCollect}
        onCreate={handleCreate}
        onOpenReplies={setActiveRoot}
        onResonate={handleResonate}
        onCollect={handleCollect}
      />
      {activeRoot ? (
        <CommentReplyPanel
          visible
          root={activeRoot}
          isSubmitting={comments.isSubmitting}
          onClose={() => setActiveRoot(null)}
          onResonate={handleResonate}
          onSubmitReply={handleReply}
        />
      ) : null}
    </FullScreenModal>
  );
}
