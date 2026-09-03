import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { APP_TEXT_COLOR } from '@/constants/Colors';
import { CommentItem } from '@/src/features/square/components/comments/CommentItem';
import {
  ACCENT_COLOR,
  COMMENT_SECTION_TITLE,
  MUTED_TEXT_COLOR,
} from '@/src/features/square/constants';
import type { useComments } from '@/src/features/square/hooks/useComments';
import type { SquareComment } from '@/src/features/square/types';

interface StoryInlineCommentsProps {
  comments: ReturnType<typeof useComments>;
  enableCollect: boolean;
  enableFlower: boolean;
  onReply: (comment: SquareComment) => void;
  onViewReplies: (comment: SquareComment) => void;
  onResonate: (comment: SquareComment) => void;
  onCollect: (comment: SquareComment) => void;
  onFlower: (comment: SquareComment) => void;
  onLayoutY: (y: number) => void;
}

export function StoryInlineComments({
  comments,
  enableCollect,
  enableFlower,
  onReply,
  onViewReplies,
  onResonate,
  onCollect,
  onFlower,
  onLayoutY,
}: StoryInlineCommentsProps) {
  return (
    <View
      onLayout={(event) => {
        onLayoutY(event.nativeEvent.layout.y);
      }}>
      <Text style={styles.heading}>
        {COMMENT_SECTION_TITLE}
        {comments.total > 0 ? ` ${comments.total}` : ''}
      </Text>
      {comments.isLoading ? (
        <ActivityIndicator style={styles.status} color={ACCENT_COLOR} />
      ) : null}
      {comments.isError ? (
        <View style={styles.status}>
          <Text style={styles.muted}>评论加载失败</Text>
          <Pressable onPress={() => void comments.refresh()}>
            <Text style={styles.retry}>重试</Text>
          </Pressable>
        </View>
      ) : null}
      {!comments.isLoading && !comments.isError && comments.items.length === 0 ? (
        <Text style={styles.muted}>暂无评论</Text>
      ) : null}
      {comments.items.map((item) => (
        <CommentItem
          key={item.id}
          comment={item}
          enableCollect={enableCollect}
          enableFlower={enableFlower}
          onResonate={onResonate}
          onCollect={onCollect}
          onFlower={onFlower}
          onReply={onReply}
          onViewReplies={onViewReplies}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 16,
    fontWeight: '700',
    color: APP_TEXT_COLOR,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  status: {
    alignItems: 'center',
    paddingVertical: 24,
    gap: 8,
  },
  muted: {
    textAlign: 'center',
    color: MUTED_TEXT_COLOR,
    fontSize: 14,
    paddingVertical: 24,
  },
  retry: {
    fontSize: 14,
    fontWeight: '600',
    color: ACCENT_COLOR,
  },
});
