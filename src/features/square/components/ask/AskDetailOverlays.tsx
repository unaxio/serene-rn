import { AskInviteModal } from '@/src/features/square/components/ask/AskInviteModal';
import { CommentReplyPanel } from '@/src/features/square/components/comments/CommentReplyPanel';
import { CommentSection } from '@/src/features/square/components/comments/CommentSection';
import { SendFlowerModal } from '@/src/features/square/components/SendFlowerModal';
import { useComments } from '@/src/features/square/hooks/useComments';
import type { useAskDetailFlow } from '@/src/features/square/hooks/useAskDetailFlow';
import type { SquareComment } from '@/src/features/square/types';

type AskDetailFlow = ReturnType<typeof useAskDetailFlow>;

interface AskDetailOverlaysProps {
  flow: AskDetailFlow;
}

export function AskDetailOverlays({ flow }: AskDetailOverlaysProps) {
  const sheet = flow.commentSheet;
  const sheetComments = useComments({
    targetType: 'ask_answer',
    targetId: sheet?.answerId ?? '',
    enabled: Boolean(sheet),
  });

  return (
    <>
      <CommentSection
        visible={sheet !== null && sheet.root === null}
        onClose={() => flow.setCommentSheet(null)}
        targetType="ask_answer"
        targetId={sheet?.answerId ?? ''}
        enableFlower
        initialReplyTo={sheet?.replyTo ?? null}
        onFlower={(comment: SquareComment) => {
          flow.openFlower({ targetType: 'comment', targetId: comment.id });
        }}
      />
      {sheet?.root ? (
        <CommentReplyPanel
          visible
          root={sheet.root}
          isSubmitting={sheetComments.isSubmitting}
          enableFlower
          onClose={() => flow.setCommentSheet(null)}
          onResonate={flow.resonateComment}
          onFlower={(comment) => flow.openFlower({ targetType: 'comment', targetId: comment.id })}
          onSubmitReply={async (parentId, content) => {
            const result = await sheetComments.submitReply(sheet.root?.id ?? parentId, parentId, content);
            return Boolean(result);
          }}
        />
      ) : null}
      <AskInviteModal visible={flow.inviteVisible} onClose={() => flow.setInviteVisible(false)} />
      <SendFlowerModal
        visible={flow.flowerTarget !== null}
        isSubmitting={flow.isPending}
        onClose={() => flow.setFlowerTarget(null)}
        onSubmit={flow.handleSendFlower}
      />
    </>
  );
}
