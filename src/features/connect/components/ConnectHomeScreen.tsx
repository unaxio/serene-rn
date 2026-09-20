import { FlashList } from '@shopify/flash-list';
import { useQueryClient } from '@tanstack/react-query';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback } from 'react';
import { RefreshControl, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { APP_TEXT_COLOR } from '@/constants/Colors';
import { deleteConnectConversation, pinConnectConversation } from '@/src/features/connect/api';
import { ConnectConversationRow } from '@/src/features/connect/components/ConnectConversationRow';
import { ConnectHomeEntries } from '@/src/features/connect/components/ConnectHomeEntries';
import { CONNECT_EMPTY_CONVERSATION, CONNECT_QUERY_KEYS } from '@/src/features/connect/constants';
import { useConnectHome } from '@/src/features/connect/hooks/useConnectHome';
import type { ConnectConversation, ConnectNotificationCategory } from '@/src/features/connect/types';
import { ACCENT_COLOR, MUTED_TEXT_COLOR, SQUARE_PAGE_BG } from '@/src/features/square/constants';
import { toastCaughtFailure } from '@/src/utils/requestError';

const MIN_TOP_INSET = 12;
const END_REACHED_THRESHOLD = 0.4;

export function ConnectHomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const home = useConnectHome();

  useFocusEffect(
    useCallback(() => {
      void queryClient.invalidateQueries({ queryKey: CONNECT_QUERY_KEYS.home });
      void queryClient.invalidateQueries({ queryKey: CONNECT_QUERY_KEYS.unread });
    }, [queryClient]),
  );

  const invalidate = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: CONNECT_QUERY_KEYS.home });
    await queryClient.invalidateQueries({ queryKey: CONNECT_QUERY_KEYS.unread });
  }, [queryClient]);

  const handlePress = useCallback(
    (item: ConnectConversation) => {
      if (item.kind === 'system') {
        router.push('/connect/notifications/system');
        return;
      }
      router.push(`/connect/dm/${item.id}`);
    },
    [router],
  );

  const handlePin = useCallback(
    (item: ConnectConversation) => {
      void (async () => {
        try {
          await pinConnectConversation(item.id, !item.pinned);
          await invalidate();
        } catch (error) {
          toastCaughtFailure(error);
        }
      })();
    },
    [invalidate],
  );

  const handleDelete = useCallback(
    (item: ConnectConversation) => {
      void (async () => {
        try {
          await deleteConnectConversation(item.id);
          await invalidate();
        } catch (error) {
          toastCaughtFailure(error);
        }
      })();
    },
    [invalidate],
  );

  const openAi = useCallback(() => {
    router.push('/connect/ai-roles');
  }, [router]);

  const openCategory = useCallback(
    (category: ConnectNotificationCategory) => {
      router.push(`/connect/notifications/${category}`);
    },
    [router],
  );

  return (
    <View style={styles.root}>
      <Text style={[styles.header, { paddingTop: insets.top + MIN_TOP_INSET }]}>连接</Text>
      <FlashList
        data={home.conversations}
        keyExtractor={(item) => `${item.kind}-${item.id}`}
        renderItem={({ item }) => (
          <ConnectConversationRow
            item={item}
            onPress={handlePress}
            onPin={handlePin}
            onDelete={handleDelete}
          />
        )}
        ListHeaderComponent={
          <ConnectHomeEntries
            unread={home.unread}
            onOpenCategory={openCategory}
            onOpenAi={openAi}
          />
        }
        ListEmptyComponent={
          home.isLoading ? null : (
            <Text style={styles.empty}>
              {home.isError ? '加载失败，下拉重试' : CONNECT_EMPTY_CONVERSATION}
            </Text>
          )
        }
        refreshControl={
          <RefreshControl
            refreshing={home.isRefreshing}
            onRefresh={() => void home.refresh()}
            tintColor={ACCENT_COLOR}
          />
        }
        onEndReached={home.loadMore}
        onEndReachedThreshold={END_REACHED_THRESHOLD}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: SQUARE_PAGE_BG,
  },
  header: {
    fontSize: 22,
    fontWeight: '700',
    color: APP_TEXT_COLOR,
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: SQUARE_PAGE_BG,
  },
  empty: {
    textAlign: 'center',
    color: MUTED_TEXT_COLOR,
    paddingVertical: 32,
  },
});
