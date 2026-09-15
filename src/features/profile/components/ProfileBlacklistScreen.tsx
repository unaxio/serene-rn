import { FlashList } from '@shopify/flash-list';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useCallback } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { APP_TEXT_COLOR } from '@/constants/Colors';
import { getBlacklist, removeBlacklist } from '@/src/features/profile/api';
import {
  PROFILE_ACCENT,
  PROFILE_MUTED,
  PROFILE_PAGE_BG,
  PROFILE_QUERY_KEYS,
} from '@/src/features/profile/constants';
import type { BlacklistItem } from '@/src/features/profile/types';
import { SquarePageHeader } from '@/src/features/square/components/SquarePageHeader';
import { formatRelativeTime } from '@/src/features/square/utils/formatRelativeTime';
import { resolveCdnUrl } from '@/src/utils/cdn';
import { toastCaughtFailure } from '@/src/utils/requestError';
import { showToast } from '@/src/utils/toast';

const AVATAR_SIZE = 44;

export function ProfileBlacklistScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: PROFILE_QUERY_KEYS.blacklist,
    queryFn: getBlacklist,
  });

  const mutation = useMutation({
    mutationFn: removeBlacklist,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEYS.blacklist });
      showToast('已解除拉黑');
    },
    onError: toastCaughtFailure,
  });

  const renderItem = useCallback(
    ({ item }: { item: BlacklistItem }) => {
      const avatar = resolveCdnUrl(item.avatarUrl) ?? item.avatarUrl;
      return (
        <View style={styles.row}>
          {avatar ? (
            <Image source={{ uri: avatar }} style={styles.avatar} contentFit="cover" />
          ) : (
            <View style={[styles.avatar, styles.avatarFallback]} />
          )}
          <View style={styles.meta}>
            <Text style={styles.name} numberOfLines={1}>
              {item.nickName || '用户'}
            </Text>
            <Text style={styles.time}>{formatRelativeTime(item.createdAt)}</Text>
          </View>
          <Pressable
            style={styles.action}
            disabled={mutation.isPending}
            onPress={() => {
              void mutation.mutateAsync(item.userId);
            }}>
            <Text style={styles.actionText}>解除</Text>
          </Pressable>
        </View>
      );
    },
    [mutation],
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <SquarePageHeader title="黑名单" onBack={() => router.back()} />
      {query.isLoading ? (
        <ActivityIndicator style={styles.loading} color={PROFILE_ACCENT} />
      ) : (
        <FlashList
          data={query.data ?? []}
          keyExtractor={(item) => item.userId}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={styles.empty}>
              {query.isError ? '加载失败，请稍后重试' : '黑名单为空'}
            </Text>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: PROFILE_PAGE_BG },
  loading: { marginTop: 40 },
  list: { paddingHorizontal: 16, paddingBottom: 24 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E2E8F0',
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: '#E2E8F0',
  },
  avatarFallback: { backgroundColor: '#CBD5E1' },
  meta: { flex: 1, gap: 2, minWidth: 0 },
  name: { fontSize: 15, fontWeight: '600', color: APP_TEXT_COLOR },
  time: { fontSize: 12, color: PROFILE_MUTED },
  action: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: '#E2E8F0',
  },
  actionText: { fontSize: 13, fontWeight: '600', color: APP_TEXT_COLOR },
  empty: { textAlign: 'center', color: PROFILE_MUTED, marginTop: 40, fontSize: 14 },
});
