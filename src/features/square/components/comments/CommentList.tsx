import { FlashList } from '@shopify/flash-list';
import { useCallback } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { CommentComposer } from '@/src/features/square/components/comments/CommentComposer';
import { CommentItem } from '@/src/features/square/components/comments/CommentItem';
import { ACCENT_COLOR, MUTED_TEXT_COLOR } from '@/src/features/square/constants';
import type { useComments } from '@/src/features/square/hooks/useComments';
import type { SquareComment } from '@/src/features/square/types';

interface CommentListProps {
  comments: ReturnType<typeof useComments>;
  enableCollect: boolean;
  onCreate: (content: string) => Promise<boolean>;
  onOpenReplies: (comment: SquareComment) => void;
  onResonate: (comment: SquareComment) => void;
  onCollect: (comment: SquareComment) => void;
}

const END_REACHED_THRESHOLD = 0.4;

export function CommentList({
  comments,
  enableCollect,
  onCreate,
  onOpenReplies,
  onResonate,
  onCollect,
}: CommentListProps) {
  const renderItem = useCallback(
    ({ item }: { item: SquareComment }) => (
      <CommentItem
        comment={item}
        enableCollect={enableCollect}
        onResonate={onResonate}
        onCollect={onCollect}
        onReply={onOpenReplies}
        onViewReplies={onOpenReplies}
      />
    ),
    [enableCollect, onCollect, onOpenReplies, onResonate],
  );

  return (
    <View style={styles.root}>
      {comments.isLoading ? (
        <ActivityIndicator style={styles.status} color={ACCENT_COLOR} />
      ) : null}
      {comments.isError ? <Text style={styles.empty}>评论加载失败</Text> : null}
      <FlashList
        data={comments.items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        onEndReached={comments.loadMore}
        onEndReachedThreshold={END_REACHED_THRESHOLD}
        ListEmptyComponent={
          comments.isLoading ? null : <Text style={styles.empty}>暂无评论</Text>
        }
      />
      <CommentComposer
        placeholder="说点什么…"
        isSubmitting={comments.isSubmitting}
        onSubmit={onCreate}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
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
