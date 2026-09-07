import { AskInviteModal } from '@/src/features/square/components/ask/AskInviteModal';
import { SendFlowerModal } from '@/src/features/square/components/SendFlowerModal';
import type { useAskDetailFlow } from '@/src/features/square/hooks/useAskDetailFlow';

type AskDetailFlow = ReturnType<typeof useAskDetailFlow>;

interface AskDetailOverlaysProps {
  flow: AskDetailFlow;
  askId: string;
}

export function AskDetailOverlays({ flow, askId }: AskDetailOverlaysProps) {
  return (
    <>
      <AskInviteModal
        visible={flow.inviteVisible}
        askId={askId}
        onClose={() => flow.setInviteVisible(false)}
      />
      <SendFlowerModal
        visible={flow.flowerTarget !== null}
        isSubmitting={flow.isPending}
        onClose={() => flow.setFlowerTarget(null)}
        onSubmit={flow.handleSendFlower}
      />
    </>
  );
}
