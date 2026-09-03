import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { FlashList } from '@shopify/flash-list';

import { FullScreenModal } from '@/src/components/FullScreenModal';
import { APP_TEXT_COLOR } from '@/constants/Colors';
import { SquareUserAvatar } from '@/src/features/square/components/SquareUserAvatar';
import {
  ACCENT_COLOR,
  ASK_INVITE_EMPTY,
  ASK_INVITE_PENDING,
  ASK_INVITE_TITLE,
  MUTED_TEXT_COLOR,
  PLACEHOLDER_TEXT_COLOR,
  SEARCH_BAR_BG,
} from '@/src/features/square/constants';
import { getFollowingList } from '@/src/features/follow/api';
import type { FollowUser } from '@/src/features/follow/types';
import { showToast } from '@/src/utils/toast';

interface AskInviteModalProps {
  visible: boolean;
  onClose: () => void;
}

const AVATAR_SIZE = 40;
const SEARCH_DEBOUNCE_MIN = 0;

export function AskInviteModal({ visible, onClose }: AskInviteModalProps) {
  const [keyword, setKeyword] = useState('');
  const query = useQuery({
    queryKey: ['follow', 'following'],
    queryFn: getFollowingList,
    enabled: visible,
  });
  const filtered = useMemo(() => {
    const list = query.data ?? [];
    const trimmed = keyword.trim();
    if (trimmed.length <= SEARCH_DEBOUNCE_MIN) {
      return list;
    }
    return list.filter((user) => (user.nickName ?? '').includes(trimmed));
  }, [keyword, query.data]);

  const renderItem = ({ item }: { item: FollowUser }) => (
    <View style={styles.row}>
      <SquareUserAvatar
        author={{
          id: item.userId,
          nickName: item.nickName ?? '',
          avatarUrl: item.avatarUrl ?? item.avatarPath ?? item.avatar ?? '',
        }}
        size={AVATAR_SIZE}
      />
      <Text style={styles.name} numberOfLines={1}>
        {item.nickName || item.username || '用户'}
      </Text>
      <Pressable
        style={styles.invite}
        onPress={() => {
          showToast(ASK_INVITE_PENDING);
        }}>
        <Text style={styles.inviteText}>邀请</Text>
      </Pressable>
    </View>
  );

  return (
    <FullScreenModal visible={visible} title={ASK_INVITE_TITLE} onBack={onClose}>
      <View style={styles.root}>
        <TextInput
          style={styles.search}
          value={keyword}
          onChangeText={setKeyword}
          placeholder="搜索好友"
          placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
        />
        {query.isLoading ? (
          <ActivityIndicator style={styles.status} color={ACCENT_COLOR} />
        ) : null}
        {query.isError ? <Text style={styles.empty}>好友列表加载失败</Text> : null}
        <FlashList
          data={filtered}
          renderItem={renderItem}
          keyExtractor={(item) => item.userId}
          ListEmptyComponent={
            query.isLoading || query.isError ? null : (
              <Text style={styles.empty}>{ASK_INVITE_EMPTY}</Text>
            )
          }
        />
      </View>
    </FullScreenModal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: 16,
  },
  search: {
    height: 40,
    borderRadius: 20,
    backgroundColor: SEARCH_BAR_BG,
    paddingHorizontal: 14,
    fontSize: 14,
    color: APP_TEXT_COLOR,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
  },
  name: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: APP_TEXT_COLOR,
  },
  invite: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: ACCENT_COLOR,
  },
  inviteText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  status: {
    paddingVertical: 24,
  },
  empty: {
    textAlign: 'center',
    color: MUTED_TEXT_COLOR,
    fontSize: 14,
    paddingVertical: 32,
  },
});
