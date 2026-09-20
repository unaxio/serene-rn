import { ScrollView, Pressable, StyleSheet, Text, View } from 'react-native';

import { APP_TEXT_COLOR } from '@/constants/Colors';
import type { FollowUser } from '@/src/features/follow/types';
import { SquareUserAvatar } from '@/src/features/square/components/SquareUserAvatar';
import { MUTED_TEXT_COLOR } from '@/src/features/square/constants';
import { useCommentMentionCandidates } from '@/src/features/square/hooks/useCommentMentionCandidates';
import type { SquareAuthor } from '@/src/features/square/types';

interface CommentMentionPickerProps {
  query: string;
  onSelect: (user: FollowUser) => void;
}

const ROW_HEIGHT = 84;
const AVATAR_SIZE = 36;
const ITEM_WIDTH = 64;
const LOAD_MORE_GAP = 48;
const EMPTY_FOLLOWING = '暂无关注的人';
const EMPTY_SEARCH = '没有找到用户';
const LOAD_FAILED = '用户列表加载失败';

export function CommentMentionPicker({ query, onSelect }: CommentMentionPickerProps) {
  const candidates = useCommentMentionCandidates(query);

  return (
    <View style={styles.row}>
      {candidates.isLoading ? <Text style={styles.hint}>加载中…</Text> : null}
      {candidates.isError ? <Text style={styles.hint}>{LOAD_FAILED}</Text> : null}
      {!candidates.isLoading && !candidates.isError && candidates.items.length === 0 ? (
        <Text style={styles.hint}>{query.length === 0 ? EMPTY_FOLLOWING : EMPTY_SEARCH}</Text>
      ) : null}
      <ScrollView
        horizontal
        keyboardShouldPersistTaps="always"
        showsHorizontalScrollIndicator={false}
        onScroll={(event) => {
          const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
          if (contentSize.width <= 0) {
            return;
          }
          if (contentOffset.x + layoutMeasurement.width >= contentSize.width - LOAD_MORE_GAP) {
            candidates.loadMore();
          }
        }}
        scrollEventThrottle={16}>
        {candidates.items.map((user) => (
          <Pressable key={user.userId} style={styles.item} onPress={() => onSelect(user)}>
            <SquareUserAvatar author={toMentionAuthor(user)} size={AVATAR_SIZE} />
            <Text style={styles.name} numberOfLines={1}>
              {user.nickName || user.username || '用户'}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

function toMentionAuthor(user: FollowUser): SquareAuthor {
  return {
    id: user.userId,
    nickName: user.nickName ?? user.username ?? '',
    avatarUrl: user.avatarUrl ?? user.avatarPath ?? user.avatar ?? '',
  };
}

const styles = StyleSheet.create({
  row: {
    height: ROW_HEIGHT,
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  item: {
    width: ITEM_WIDTH,
    alignItems: 'center',
    gap: 6,
    paddingTop: 8,
  },
  name: {
    width: ITEM_WIDTH - 8,
    fontSize: 11,
    textAlign: 'center',
    color: APP_TEXT_COLOR,
  },
  hint: {
    position: 'absolute',
    alignSelf: 'center',
    fontSize: 12,
    color: MUTED_TEXT_COLOR,
  },
});
