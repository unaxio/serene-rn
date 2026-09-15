import { FlashList } from '@shopify/flash-list';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useCallback } from 'react';
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { APP_TEXT_COLOR } from '@/constants/Colors';
import {
  getNotifications,
  getUnreadNotificationCount,
  markNotificationsRead,
} from '@/src/features/profile/api';
import {
  PROFILE_ACCENT,
  PROFILE_MUTED,
  PROFILE_PAGE_BG,
  PROFILE_QUERY_KEYS,
} from '@/src/features/profile/constants';
import { useProfileInfiniteQuery } from '@/src/features/profile/hooks/useProfileInfiniteQuery';
import type { ProfileNotificationItem } from '@/src/features/profile/types';
import { SquarePageHeader } from '@/src/features/square/components/SquarePageHeader';
import {
  ACCENT_COLOR,
  SHARE_LIST_END_REACHED_THRESHOLD,
} from '@/src/features/square/constants';
import { formatRelativeTime } from '@/src/features/square/utils/formatRelativeTime';
import { toastCaughtFailure } from '@/src/utils/requestError';
import { showToast } from '@/src/utils/toast';

export function ProfileMessagesScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const list = useProfileInfiniteQuery(PROFILE_QUERY_KEYS.notifications(), (page, pageSize) =>
    getNotifications(page, pageSize),
  );
  const unreadQuery = useQuery({
    queryKey: PROFILE_QUERY_KEYS.unreadCount,
    queryFn: getUnreadNotificationCount,
  });

  const markAll = useMutation({
    mutationFn: () => markNotificationsRead({ all: true }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEYS.notifications() });
      await queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEYS.unreadCount });
      showToast('已全部标为已读');
    },
    onError: toastCaughtFailure,
  });

  const renderItem = useCallback(({ item }: { item: ProfileNotificationItem }) => {
    return (
      <View style={[styles.row, !item.isRead && styles.rowUnread]}>
        <View style={styles.meta}>
          <Text style={styles.title} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.body} numberOfLines={2}>
            {item.body}
          </Text>
          <Text style={styles.time}>{formatRelativeTime(item.createdAt)}</Text>
        </View>
        {!item.isRead ? <View style={styles.dot} /> : null}
      </View>
    );
  }, []);

  return (
    <SafeAreaView style={styles.safe} edges={[]}>
      <SquarePageHeader title="消息中心" onBack={() => router.back()} />
      <View style={styles.toolbar}>
        <Text style={styles.unread}>未读 {unreadQuery.data ?? 0}</Text>
        <Pressable
          disabled={markAll.isPending}
          onPress={() => {
            void markAll.mutateAsync();
          }}>
          <Text style={styles.markAll}>全部已读</Text>
        </Pressable>
      </View>
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
              void unreadQuery.refetch();
            }}
          />
        }
        ListEmptyComponent={
          list.isLoading ? (
            <ActivityIndicator style={styles.status} color={PROFILE_ACCENT} />
          ) : (
            <Text style={styles.empty}>
              {list.isError ? '加载失败，请下拉重试' : '暂无消息'}
            </Text>
          )
        }
        ListFooterComponent={
          list.isFetchingMore ? (
            <ActivityIndicator style={styles.footer} color={PROFILE_ACCENT} />
          ) : null
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: PROFILE_PAGE_BG },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  unread: { fontSize: 13, color: PROFILE_MUTED },
  markAll: { fontSize: 13, fontWeight: '600', color: PROFILE_ACCENT },
  list: { paddingHorizontal: 16, paddingBottom: 24 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E2E8F0',
  },
  rowUnread: { backgroundColor: '#FFF7ED' },
  meta: { flex: 1, gap: 2, minWidth: 0 },
  title: { fontSize: 15, fontWeight: '600', color: APP_TEXT_COLOR },
  body: { fontSize: 13, color: PROFILE_MUTED, lineHeight: 18 },
  time: { fontSize: 12, color: PROFILE_MUTED },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: PROFILE_ACCENT,
  },
  status: { marginTop: 40 },
  empty: { textAlign: 'center', color: PROFILE_MUTED, marginTop: 40, fontSize: 14 },
  footer: { paddingVertical: 16 },
});
