import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { FullScreenModal } from '@/src/components/FullScreenModal';
import { CommentComposer } from '@/src/features/square/components/comments/CommentComposer';
import { SendFlowerModal } from '@/src/features/square/components/SendFlowerModal';
import { ShareImagePreviewModal } from '@/src/features/square/components/share/ShareImagePreviewModal';
import { ShareItem } from '@/src/features/square/components/share/ShareItem';
import { SHARE_LIST_BG } from '@/src/features/square/constants';
import { useShareComposer } from '@/src/features/square/hooks/useShareComposer';
import { useSquareAction } from '@/src/features/square/hooks/useSquareAction';
import type { Share } from '@/src/features/square/types';

interface ProfileShareDetailModalProps {
  share: Share | null;
  visible: boolean;
  onClose: () => void;
}

interface ImagePreviewState {
  uris: string[];
  index: number;
}

export function ProfileShareDetailModal({
  share,
  visible,
  onClose,
}: ProfileShareDetailModalProps) {
  const { runAction, isPending } = useSquareAction();
  const composer = useShareComposer();
  const [flowerOpen, setFlowerOpen] = useState(false);
  const [preview, setPreview] = useState<ImagePreviewState | null>(null);

  const handleResonate = useCallback(() => {
    if (!share) {
      return;
    }
    void runAction({
      targetType: 'share',
      targetId: share.id,
      actionType: 'resonate',
    });
  }, [runAction, share]);

  const handleSendFlower = useCallback(
    async (giftFlowerId: string, quantity: number) => {
      if (!share) {
        return false;
      }
      const result = await runAction({
        targetType: 'share',
        targetId: share.id,
        actionType: 'flower',
        giftFlowerId,
        quantity,
      });
      return result !== null;
    },
    [runAction, share],
  );

  const handleClose = useCallback(() => {
    setFlowerOpen(false);
    setPreview(null);
    onClose();
  }, [onClose]);

  return (
    <>
      <FullScreenModal
        visible={visible && share !== null}
        title="分享"
        onBack={handleClose}
        backgroundColor={SHARE_LIST_BG}>
        {share ? (
          <View style={styles.root}>
            <ScrollView
              style={styles.scroll}
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled">
              <ShareItem
                share={share}
                onResonate={handleResonate}
                onFlower={() => setFlowerOpen(true)}
                onPreviewImages={(uris, index) => setPreview({ uris, index })}
                onOpenComposer={composer.open}
                inlineComposer={composer.getInlineComposer(share.id)}
              />
            </ScrollView>
            {composer.isSticky && composer.visible ? (
              <CommentComposer
                ref={composer.composerRef}
                placeholder={composer.placeholder}
                isSubmitting={composer.isSubmitting}
                onSubmit={composer.submit}
              />
            ) : null}
          </View>
        ) : null}
      </FullScreenModal>
      <SendFlowerModal
        visible={flowerOpen && share !== null}
        isSubmitting={isPending}
        onClose={() => setFlowerOpen(false)}
        onSubmit={handleSendFlower}
      />
      <ShareImagePreviewModal
        visible={preview !== null}
        uris={preview?.uris ?? []}
        initialIndex={preview?.index ?? 0}
        onClose={() => setPreview(null)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 24 },
});
