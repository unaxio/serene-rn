import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import { RefreshControl, StyleSheet, Text, View } from 'react-native';

import { ConnectAuthGate } from '@/src/features/connect/components/ConnectAuthGate';
import { ConnectNotificationRow } from '@/src/features/connect/components/ConnectNotificationRow';
import { SystemMuteBar } from '@/src/features/connect/components/SystemMuteBar';
import { CONNECT_CATEGORY_TITLES, CONNECT_EMPTY_NOTIFICATION } from '@/src/features/connect/constants';
import { useClearCategoryOnLeave } from '@/src/features/connect/hooks/useClearCategoryOnLeave';
import { useConnectNotificationActions } from '@/src/features/connect/hooks/useConnectNotificationActions';
import { useConnectNotifications } from '@/src/features/connect/hooks/useConnectNotifications';
import type { ConnectNotificationCategory } from '@/src/features/connect/types';
import { SendFlowerModal } from '@/src/features/square/components/SendFlowerModal';
import { SquarePageHeader } from '@/src/features/square/components/SquarePageHeader';
import { ACCENT_COLOR, MUTED_TEXT_COLOR, SQUARE_PAGE_BG } from '@/src/features/square/constants';

interface ConnectNotificationScreenProps {
  category: ConnectNotificationCategory;
}

const END_REACHED_THRESHOLD = 0.4;

export function ConnectNotificationScreen({ category }: ConnectNotificationScreenProps) {
  const router = useRouter();
  const list = useConnectNotifications(category);
  const actions = useConnectNotificationActions(category);
  useClearCategoryOnLeave(category);

  return (
    <ConnectAuthGate>
      <View style={styles.root}>
        <SquarePageHeader title={CONNECT_CATEGORY_TITLES[category]} onBack={() => router.back()} />
        <FlashList
          data={list.items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ConnectNotificationRow item={item} onPress={actions.handlePress} onAction={actions.handleAction} />
          )}
          ListEmptyComponent={
            <Text style={styles.empty}>
              {list.isLoading ? '加载中' : list.isError ? '加载失败，下拉重试' : CONNECT_EMPTY_NOTIFICATION}
            </Text>
          }
          ListFooterComponent={category === 'system' ? <SystemMuteBar /> : null}
          refreshControl={
            <RefreshControl
              refreshing={list.isRefreshing}
              onRefresh={() => void list.refresh()}
              tintColor={ACCENT_COLOR}
            />
          }
          onEndReached={list.loadMore}
          onEndReachedThreshold={END_REACHED_THRESHOLD}
        />
        <SendFlowerModal
          visible={actions.flowerUserId !== null}
          isSubmitting={actions.isPending}
          onClose={() => actions.setFlowerUserId(null)}
          onSubmit={actions.handleSendFlower}
        />
      </View>
    </ConnectAuthGate>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: SQUARE_PAGE_BG },
  empty: { textAlign: 'center', color: MUTED_TEXT_COLOR, padding: 32 },
});
