import { FlashList } from '@shopify/flash-list';
import { useCallback, type Ref } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import {
  CommentComposer,
  type CommentComposerHandle,
} from '@/src/features/square/components/comments/CommentComposer';
import { CommentItem } from '@/src/features/square/components/comments/CommentItem';
import {
  ACCENT_COLOR,
  COMMENT_COMPOSER_PLACEHOLDER,
  MUTED_TEXT_COLOR,
} from '@/src/features/square/constants';
import type { useComments } from '@/src/features/square/hooks/useComments';
import type { SquareComment } from '@/src/features/square/types';
import { getReplyPlaceholder } from '@/src/features/square/utils/displayAuthor';

interface CommentListProps {
  comments: ReturnType<typeof useComments>;
  enableCollect: boolean;
  enableFlower: boolean;
  replyTo: SquareComment | null;
  composerRef?: Ref<CommentComposerHandle>;
  onCreate: (content: string) => Promise<boolean>;
  onReply: (comment: SquareComment) => void;
  onViewReplies: (comment: SquareComment) => void;
  onResonate: (comment: SquareComment) => void;
  onCollect: (comment: SquareComment) => void;
  onFlower?: (comment: SquareComment) => void;
}

const END_REACHED_THRESHOLD = 0.4;

export function CommentList({
  comments,
  enableCollect,
  enableFlower,
  replyTo,
  composerRef,
  onCreate,
  onReply,
  onViewReplies,
  onResonate,
  onCollect,
  onFlower,
}: CommentListProps) {
  const renderItem = useCallback(
    ({ item }: { item: SquareComment }) => (
      <CommentItem
        comment={item}
        enableCollect={enableCollect}
        enableFlower={enableFlower}
        onResonate={onResonate}
        onCollect={onCollect}
        onFlower={onFlower}
        onReply={onReply}
        onViewReplies={onViewReplies}
      />
    ),
    [enableCollect, enableFlower, onCollect, onFlower, onReply, onResonate, onViewReplies],
  );

  const placeholder = replyTo
    ? getReplyPlaceholder(replyTo.author)
    : COMMENT_COMPOSER_PLACEHOLDER;

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
        ref={composerRef}
        placeholder={placeholder}
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
