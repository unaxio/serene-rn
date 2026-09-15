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

import { getFlowersReceived } from '@/src/features/profile/api';
import { ProfileReceivedFlowerRow } from '@/src/features/profile/components/ProfileReceivedFlowerRow';
import {
  PROFILE_ACCENT,
  PROFILE_MUTED,
  PROFILE_PAGE_BG,
  PROFILE_QUERY_KEYS,
} from '@/src/features/profile/constants';
import { useProfileInfiniteQuery } from '@/src/features/profile/hooks/useProfileInfiniteQuery';
import type { FlowerReceivedLedgerItem } from '@/src/features/profile/types';
import { SendFlowerModal } from '@/src/features/square/components/SendFlowerModal';
import { SquarePageHeader } from '@/src/features/square/components/SquarePageHeader';
import {
  ACCENT_COLOR,
  SHARE_LIST_END_REACHED_THRESHOLD,
} from '@/src/features/square/constants';
import { useSquareAction } from '@/src/features/square/hooks/useSquareAction';

export function ProfileReceivedFlowersScreen() {
  const router = useRouter();
  const { runAction, isPending } = useSquareAction();
  const [flowerActionId, setFlowerActionId] = useState<string | null>(null);
  const list = useProfileInfiniteQuery(PROFILE_QUERY_KEYS.flowersReceived, getFlowersReceived);

  const handleSendFlower = useCallback(
    async (giftFlowerId: string, quantity: number) => {
      if (!flowerActionId) {
        return false;
      }
      const result = await runAction({
        targetType: 'user_action',
        targetId: flowerActionId,
        actionType: 'flower',
        giftFlowerId,
        quantity,
      });
      return result !== null;
    },
    [flowerActionId, runAction],
  );

  const renderItem = useCallback(
    ({ item }: { item: FlowerReceivedLedgerItem }) => (
      <ProfileReceivedFlowerRow item={item} onReply={() => setFlowerActionId(item.id)} />
    ),
    [],
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <SquarePageHeader title="收到的花" onBack={() => router.back()} />
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
              {list.isError ? '加载失败，请下拉重试' : '还没有收到花'}
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
        visible={flowerActionId !== null}
        isSubmitting={isPending}
        onClose={() => setFlowerActionId(null)}
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
