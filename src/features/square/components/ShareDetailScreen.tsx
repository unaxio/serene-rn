import { useRouter } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { CommentComposer } from '@/src/features/square/components/comments/CommentComposer';
import { SendFlowerModal } from '@/src/features/square/components/SendFlowerModal';
import { ShareImagePreviewModal } from '@/src/features/square/components/share/ShareImagePreviewModal';
import { ShareItem } from '@/src/features/square/components/share/ShareItem';
import { SquarePageHeader } from '@/src/features/square/components/SquarePageHeader';
import {
  ACCENT_COLOR,
  MUTED_TEXT_COLOR,
  SHARE_LIST_BG,
} from '@/src/features/square/constants';
import { useBindCommentFocusScroll } from '@/src/features/square/hooks/useBindCommentFocusScroll';
import { useShareComposer } from '@/src/features/square/hooks/useShareComposer';
import { useShareDetail } from '@/src/features/square/hooks/useShareDetail';
import { useSquareAction } from '@/src/features/square/hooks/useSquareAction';

const SHARE_DETAIL_TITLE = '分享';

interface ShareDetailScreenProps {
  shareId: string;
}

interface ImagePreviewState {
  uris: string[];
  index: number;
}

export function ShareDetailScreen({ shareId }: ShareDetailScreenProps) {
  const router = useRouter();
  const { share, isLoading, isError, refetch } = useShareDetail(shareId);
  const { runAction, isPending } = useSquareAction();
  const composer = useShareComposer();
  const [flowerOpen, setFlowerOpen] = useState(false);
  const [preview, setPreview] = useState<ImagePreviewState | null>(null);
  const scrollRef = useRef<ScrollView>(null);
  const offsetYRef = useRef(0);
  const getOffsetY = useCallback(() => offsetYRef.current, []);
  useBindCommentFocusScroll(scrollRef, getOffsetY);

  const handleSendFlower = useCallback(
    async (giftFlowerId: string, quantity: number) => {
      const result = await runAction({
        targetType: 'share',
        targetId: shareId,
        actionType: 'flower',
        giftFlowerId,
        quantity,
      });
      return result !== null;
    },
    [runAction, shareId],
  );

  return (
    <View style={styles.root}>
      <SquarePageHeader title={SHARE_DETAIL_TITLE} onBack={() => router.back()} />
      {isLoading ? <ActivityIndicator style={styles.status} color={ACCENT_COLOR} /> : null}
      {isError || (!isLoading && !share) ? (
        <View style={styles.status}>
          <Text style={styles.error}>分享加载失败</Text>
          <Pressable onPress={() => void refetch()}>
            <Text style={styles.retry}>重试</Text>
          </Pressable>
        </View>
      ) : null}
      {share ? (
        <View style={styles.body}>
          <ScrollView
            ref={scrollRef}
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            scrollEventThrottle={16}
            onScroll={(event) => {
              offsetYRef.current = event.nativeEvent.contentOffset.y;
            }}>
            <ShareItem
              share={share}
              locateComments
              onResonate={() => {
                void runAction({
                  targetType: 'share',
                  targetId: share.id,
                  actionType: 'resonate',
                });
              }}
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
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: SHARE_LIST_BG },
  body: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 24 },
  status: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 },
  error: { fontSize: 14, color: MUTED_TEXT_COLOR },
  retry: { fontSize: 14, fontWeight: '600', color: ACCENT_COLOR },
});
