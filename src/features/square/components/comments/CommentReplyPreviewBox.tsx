import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { APP_TEXT_COLOR } from '@/constants/Colors';
import {
  COMMENT_HIGHLIGHT_COLOR,
  COMMENT_LONG_PRESS_DELAY_MS,
  MUTED_TEXT_COLOR,
  TOP_REPLIES_PREVIEW_COUNT,
} from '@/src/features/square/constants';
import type { SquareComment } from '@/src/features/square/types';
import { showCommentActionMenu } from '@/src/features/square/utils/commentActionMenu';
import { getAuthorDisplayName } from '@/src/features/square/utils/displayAuthor';
import { resolveParentReplyName } from '@/src/features/square/utils/resolveParentReplyName';

interface CommentReplyPreviewBoxProps {
  comment: SquareComment;
  onReply: (reply: SquareComment) => void;
  onViewReplies?: (comment: SquareComment) => void;
}

export function CommentReplyPreviewBox({
  comment,
  onReply,
  onViewReplies,
}: CommentReplyPreviewBoxProps) {
  const previewReplies = comment.topReplies.slice(0, TOP_REPLIES_PREVIEW_COUNT);
  const showViewMore = Boolean(onViewReplies) && comment.replyCount > previewReplies.length;
  const parentNameMap = useMemo(() => {
    const map = new Map<string, string>();
    map.set(comment.id, getAuthorDisplayName(comment.author));
    return map;
  }, [comment.author, comment.id]);

  if (previewReplies.length === 0 && !showViewMore) {
    return null;
  }

  return (
    <View style={styles.previewBox}>
      {previewReplies.map((reply) => {
        const parentReplyName = resolveParentReplyName(reply, parentNameMap);
        return (
          <Pressable
            key={reply.id}
            onPress={() => onReply(reply)}
            onLongPress={() => showCommentActionMenu(reply.content)}
            delayLongPress={COMMENT_LONG_PRESS_DELAY_MS}>
            <Text style={styles.previewLine} numberOfLines={2}>
              <Text style={styles.previewName}>{getAuthorDisplayName(reply.author)}</Text>
              {parentReplyName ? (
                <Text style={styles.previewReplyHint}> 回复 {parentReplyName}</Text>
              ) : null}
              {`：${reply.content}`}
            </Text>
          </Pressable>
        );
      })}
      {showViewMore ? (
        <Pressable onPress={() => onViewReplies?.(comment)}>
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
  previewReplyHint: {
    fontWeight: '400',
    color: MUTED_TEXT_COLOR,
  },
  viewMore: {
    fontSize: 13,
    fontWeight: '600',
    color: COMMENT_HIGHLIGHT_COLOR,
  },
});
