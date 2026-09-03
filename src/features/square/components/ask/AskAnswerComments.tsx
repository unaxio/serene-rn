import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { AskReplyPreview } from '@/src/features/square/components/ask/AskReplyPreview';
import { CommentItem } from '@/src/features/square/components/comments/CommentItem';
import { ACCENT_COLOR, ASK_COMMENT_PREVIEW_INDENT, MUTED_TEXT_COLOR } from '@/src/features/square/constants';
import { useComments } from '@/src/features/square/hooks/useComments';
import type { SquareComment } from '@/src/features/square/types';

interface AskAnswerCommentsProps {
  answerId: string;
  commentCount: number;
  onReply: (comment: SquareComment) => void;
  onViewReplies: (comment: SquareComment) => void;
  onResonate: (comment: SquareComment) => void;
  onFlower: (comment: SquareComment) => void;
}

export function AskAnswerComments({
  answerId,
  commentCount,
  onReply,
  onViewReplies,
  onResonate,
  onFlower,
}: AskAnswerCommentsProps) {
  const comments = useComments({
    targetType: 'ask_answer',
    targetId: answerId,
    enabled: commentCount > 0,
  });

  if (commentCount === 0) {
    return null;
  }

  if (comments.isLoading) {
    return <ActivityIndicator style={styles.status} color={ACCENT_COLOR} />;
  }

  if (comments.isError) {
    return <Text style={styles.muted}>评论加载失败</Text>;
  }

  return (
    <View>
      {comments.items.map((item) => (
        <View key={item.id}>
          <CommentItem
            comment={item}
            enableFlower
            showReplyPreview={false}
            onResonate={onResonate}
            onFlower={onFlower}
            onReply={onReply}
          />
          <View style={styles.previewWrap}>
            <AskReplyPreview
              comment={item}
              onReply={onReply}
              onViewAll={onViewReplies}
            />
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  status: {
    paddingVertical: 12,
  },
  muted: {
    fontSize: 13,
    color: MUTED_TEXT_COLOR,
    paddingVertical: 8,
  },
  previewWrap: {
    marginLeft: ASK_COMMENT_PREVIEW_INDENT,
    marginTop: -8,
    paddingBottom: 8,
  },
});
