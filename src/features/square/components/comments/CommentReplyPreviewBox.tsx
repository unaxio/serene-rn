import { Pressable, StyleSheet, Text, View } from 'react-native';

import { APP_TEXT_COLOR } from '@/constants/Colors';
import {
  COMMENT_HIGHLIGHT_COLOR,
  TOP_REPLIES_PREVIEW_COUNT,
} from '@/src/features/square/constants';
import type { SquareComment } from '@/src/features/square/types';
import { getAuthorDisplayName } from '@/src/features/square/utils/displayAuthor';

interface CommentReplyPreviewBoxProps {
  comment: SquareComment;
  onViewReplies?: (comment: SquareComment) => void;
}

export function CommentReplyPreviewBox({
  comment,
  onViewReplies,
}: CommentReplyPreviewBoxProps) {
  if (comment.topReplies.length === 0) {
    return null;
  }

  const extraReplyCount = comment.replyCount - TOP_REPLIES_PREVIEW_COUNT;

  return (
    <View style={styles.previewBox}>
      {comment.topReplies.map((reply) => (
        <Text key={reply.id} style={styles.previewLine} numberOfLines={2}>
          <Text style={styles.previewName}>{getAuthorDisplayName(reply.author)}</Text>
          {`：${reply.content}`}
        </Text>
      ))}
      {extraReplyCount > 0 && onViewReplies ? (
        <Pressable onPress={() => onViewReplies(comment)}>
          <Text style={styles.viewMore}>查看 {comment.replyCount} 条回复</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  previewBox: {
    marginTop: 8,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    gap: 6,
  },
  previewLine: {
    fontSize: 13,
    lineHeight: 18,
    color: APP_TEXT_COLOR,
  },
  previewName: {
    fontWeight: '600',
  },
  viewMore: {
    fontSize: 13,
    fontWeight: '600',
    color: COMMENT_HIGHLIGHT_COLOR,
  },
});
