import { FlashList } from '@shopify/flash-list';
import { useCallback, useState } from 'react';
import { ActivityIndicator, RefreshControl, StyleSheet, View } from 'react-native';

import { SendFlowerModal } from '@/src/features/square/components/SendFlowerModal';
import { ShareImagePreviewModal } from '@/src/features/square/components/share/ShareImagePreviewModal';
import { ShareItem } from '@/src/features/square/components/share/ShareItem';
import { ShareListStatus } from '@/src/features/square/components/share/ShareListStatus';
import {
  ACCENT_COLOR,
  SHARE_LIST_BG,
  SHARE_LIST_EMPTY_MESSAGE,
  SHARE_LIST_END_REACHED_THRESHOLD,
} from '@/src/features/square/constants';
import { useGuardSendFlower } from '@/src/features/square/hooks/useGuardSendFlower';
import { useShares } from '@/src/features/square/hooks/useShares';
import { useSquareAction } from '@/src/features/square/hooks/useSquareAction';
import type { Share } from '@/src/features/square/types';

interface ImagePreviewState {
  uris: string[];
  index: number;
}

export function ShareList() {
  const { items, isLoading, isError, isRefreshing, isFetchingMore, loadMore, refresh, refetch } =
    useShares();
  const { runAction, isPending } = useSquareAction();
  const canSendFlower = useGuardSendFlower();
  const [flowerShareId, setFlowerShareId] = useState<string | null>(null);
  const [preview, setPreview] = useState<ImagePreviewState | null>(null);

  const handleResonate = useCallback(
    (shareId: string) => {
      void runAction({
        targetType: 'share',
        targetId: shareId,
        actionType: 'resonate',
      });
    },
    [runAction],
  );

  const handleSendFlower = useCallback(
    async (giftFlowerId: string, quantity: number) => {
      if (!flowerShareId) {
        return false;
      }
      const result = await runAction({
        targetType: 'share',
        targetId: flowerShareId,
        actionType: 'flower',
        giftFlowerId,
        quantity,
      });
      return result !== null;
    },
    [flowerShareId, runAction],
  );

  const handleFlower = useCallback(
    (share: Share) => {
      if (!canSendFlower(share.author.id)) {
        return;
      }
      setFlowerShareId(share.id);
    },
    [canSendFlower],
  );

  const handlePreviewImages = useCallback((uris: string[], index: number) => {
    setPreview({ uris, index });
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: Share }) => (
      <ShareItem
        share={item}
        onResonate={handleResonate}
        onFlower={handleFlower}
        onPreviewImages={handlePreviewImages}
      />
    ),
    [handleFlower, handlePreviewImages, handleResonate],
  );

  const listEmpty = (() => {
    if (isLoading) {
      return <ActivityIndicator style={styles.status} color={ACCENT_COLOR} />;
    }
    if (isError) {
      return <ShareListStatus message="加载失败，请稍后重试" onRetry={() => void refetch()} />;
    }
    return <ShareListStatus message={SHARE_LIST_EMPTY_MESSAGE} />;
  })();

  return (
    <View style={styles.root}>
      <FlashList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        onEndReached={loadMore}
        onEndReachedThreshold={SHARE_LIST_END_REACHED_THRESHOLD}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            tintColor={ACCENT_COLOR}
            onRefresh={() => {
              void refresh();
            }}
          />
        }
        ListEmptyComponent={listEmpty}
        ListFooterComponent={
          isFetchingMore ? <ActivityIndicator style={styles.footer} color={ACCENT_COLOR} /> : null
        }
      />
      <SendFlowerModal
        visible={flowerShareId !== null}
        isSubmitting={isPending}
        onClose={() => setFlowerShareId(null)}
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
  root: {
    flex: 1,
    backgroundColor: SHARE_LIST_BG,
  },
  status: {
    paddingVertical: 48,
  },
  footer: {
    paddingVertical: 16,
  },
});
