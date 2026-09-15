import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
  Text,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { getResonateReceived } from '@/src/features/profile/api';
import { ProfileLikeRow } from '@/src/features/profile/components/ProfileLikeRow';
import {
  PROFILE_ACCENT,
  PROFILE_MUTED,
  PROFILE_PAGE_BG,
  PROFILE_QUERY_KEYS,
} from '@/src/features/profile/constants';
import { useProfileInfiniteQuery } from '@/src/features/profile/hooks/useProfileInfiniteQuery';
import type { ResonateReceivedItem } from '@/src/features/profile/types';
import { SendFlowerModal } from '@/src/features/square/components/SendFlowerModal';
import { SquarePageHeader } from '@/src/features/square/components/SquarePageHeader';
import {
  ACCENT_COLOR,
  SHARE_LIST_END_REACHED_THRESHOLD,
} from '@/src/features/square/constants';
import { useSquareAction } from '@/src/features/square/hooks/useSquareAction';

export function ProfileLikesScreen() {
  const router = useRouter();
  const { runAction, isPending } = useSquareAction();
  const [flowerUserId, setFlowerUserId] = useState<string | null>(null);
  const list = useProfileInfiniteQuery(PROFILE_QUERY_KEYS.resonateReceived, getResonateReceived);

  const handleSendFlower = useCallback(
    async (giftFlowerId: string, quantity: number) => {
      if (!flowerUserId) {
        return false;
      }
      const result = await runAction({
        targetType: 'user',
        targetId: flowerUserId,
        actionType: 'flower',
        giftFlowerId,
        quantity,
      });
      return result !== null;
    },
    [flowerUserId, runAction],
  );

  const renderItem = useCallback(
    ({ item }: { item: ResonateReceivedItem }) => (
      <ProfileLikeRow item={item} onThank={() => setFlowerUserId(item.fromUser.id)} />
    ),
    [],
  );

  return (
    <SafeAreaView style={styles.safe} edges={[]}>
      <SquarePageHeader title="获赞记录" onBack={() => router.back()} />
      <FlashList
        data={list.items}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        onEndReached={list.loadMore}
        onEndReachedThreshold={SHARE_LIST_END_REACHED_THRESHOLD}
        refreshControl={
          <RefreshControl
            refreshing={list.isRefreshing}
            tintColor={ACCENT_COLOR}
            onRefresh={() => {
              void list.refresh();
            }}
          />
        }
        ListEmptyComponent={
          list.isLoading ? (
            <ActivityIndicator style={styles.status} color={PROFILE_ACCENT} />
          ) : (
            <Text style={styles.empty}>
              {list.isError ? '加载失败，请下拉重试' : '暂无获赞记录'}
            </Text>
          )
        }
        ListFooterComponent={
          list.isFetchingMore ? (
            <ActivityIndicator style={styles.footer} color={PROFILE_ACCENT} />
          ) : null
        }
      />
      <SendFlowerModal
        visible={flowerUserId !== null}
        isSubmitting={isPending}
        onClose={() => setFlowerUserId(null)}
        onSubmit={handleSendFlower}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: PROFILE_PAGE_BG },
  list: { paddingHorizontal: 16, paddingBottom: 24 },
  status: { marginTop: 40 },
  empty: { textAlign: 'center', color: PROFILE_MUTED, marginTop: 40, fontSize: 14 },
  footer: { paddingVertical: 16 },
});
