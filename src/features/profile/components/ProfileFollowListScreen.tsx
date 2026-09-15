import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { APP_TEXT_COLOR } from '@/constants/Colors';
import {
  followUser,
  getFollowersList,
  getFollowingList,
  unfollowUser,
} from '@/src/features/follow/api';
import { FOLLOW_QUERY_KEYS } from '@/src/features/follow/constants';
import type { FollowUser } from '@/src/features/follow/types';
import { ProfileFollowUserRow } from '@/src/features/profile/components/ProfileFollowUserRow';
import { PROFILE_ACCENT, PROFILE_MUTED, PROFILE_PAGE_BG } from '@/src/features/profile/constants';
import {
  getFollowActionLabel,
  isFollowActionPrimary,
  shouldFollowNext,
} from '@/src/features/profile/utils/followActionLabel';
import { SquarePageHeader } from '@/src/features/square/components/SquarePageHeader';
import { toastCaughtFailure } from '@/src/utils/requestError';
import { showToast } from '@/src/utils/toast';

type ListMode = 'following' | 'followers';

interface ProfileFollowListScreenProps {
  mode: ListMode;
}

function displayName(user: FollowUser): string {
  return user.nickName?.trim() || user.username?.trim() || '用户';
}

function resolveRelation(user: FollowUser, mode: ListMode) {
  if (user.relation) {
    return user.relation;
  }
  return mode === 'following' ? 'following' : 'followed_by';
}

export function ProfileFollowListScreen({ mode }: ProfileFollowListScreenProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [keyword, setKeyword] = useState('');
  const title = mode === 'following' ? '关注' : '粉丝';
  const isFollowingMode = mode === 'following';

  const query = useQuery({
    queryKey: isFollowingMode ? FOLLOW_QUERY_KEYS.following : FOLLOW_QUERY_KEYS.followers,
    queryFn: isFollowingMode ? getFollowingList : getFollowersList,
  });

  const mutation = useMutation({
    mutationFn: async (input: { userId: string; nextFollow: boolean }) => {
      if (input.nextFollow) {
        await followUser(input.userId);
        return;
      }
      await unfollowUser(input.userId);
    },
    onSuccess: async (_data, input) => {
      await queryClient.invalidateQueries({ queryKey: FOLLOW_QUERY_KEYS.following });
      await queryClient.invalidateQueries({ queryKey: FOLLOW_QUERY_KEYS.followers });
      showToast(input.nextFollow ? '关注成功' : '已取消关注');
    },
    onError: toastCaughtFailure,
  });

  const filtered = useMemo(() => {
    const list = query.data ?? [];
    const trimmed = keyword.trim().toLowerCase();
    if (!trimmed) {
      return list;
    }
    return list.filter((user) => displayName(user).toLowerCase().includes(trimmed));
  }, [keyword, query.data]);

  const renderItem = useCallback(
    ({ item }: { item: FollowUser }) => {
      const relation = resolveRelation(item, mode);
      return (
        <ProfileFollowUserRow
          user={item}
          actionLabel={getFollowActionLabel(relation)}
          actionPrimary={isFollowActionPrimary(relation)}
          actionDisabled={mutation.isPending}
          onPressUser={() => router.push(`/users/${item.userId}`)}
          onPressAction={() => {
            void mutation.mutateAsync({
              userId: item.userId,
              nextFollow: shouldFollowNext(relation),
            });
          }}
        />
      );
    },
    [mode, mutation, router],
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <SquarePageHeader title={title} onBack={() => router.back()} />
      <View style={styles.searchWrap}>
        <TextInput
          style={styles.search}
          value={keyword}
          onChangeText={setKeyword}
          placeholder="搜索昵称"
          placeholderTextColor={PROFILE_MUTED}
          autoCapitalize="none"
        />
      </View>
      {query.isLoading ? (
        <ActivityIndicator style={styles.loading} color={PROFILE_ACCENT} />
      ) : (
        <FlashList
          data={filtered}
          keyExtractor={(item) => item.userId}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={styles.empty}>{keyword.trim() ? '无匹配用户' : '暂无数据'}</Text>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: PROFILE_PAGE_BG },
  searchWrap: { paddingHorizontal: 16, paddingBottom: 8 },
  search: {
    height: 40,
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
    fontSize: 14,
    color: APP_TEXT_COLOR,
  },
  loading: { marginTop: 40 },
  list: { paddingHorizontal: 16, paddingBottom: 24 },
  empty: { textAlign: 'center', color: PROFILE_MUTED, marginTop: 40, fontSize: 14 },
});
