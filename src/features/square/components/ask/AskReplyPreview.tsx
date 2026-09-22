import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { APP_TEXT_COLOR } from '@/constants/Colors';
import {
  ASK_REPLY_EXPAND_COUNT,
  ASK_VIEW_ALL_REPLIES_LABEL,
  COMMENT_HIGHLIGHT_COLOR,
  COMMENT_LONG_PRESS_DELAY_MS,
  MUTED_TEXT_COLOR,
  TOP_REPLIES_PREVIEW_COUNT,
} from '@/src/features/square/constants';
import { useCommentReplies } from '@/src/features/square/hooks/useCommentReplies';
import type { SquareComment } from '@/src/features/square/types';
import { showCommentActionMenu } from '@/src/features/square/utils/commentActionMenu';
import { getAuthorDisplayName } from '@/src/features/square/utils/displayAuthor';
import { resolveParentReplyName } from '@/src/features/square/utils/resolveParentReplyName';

interface AskReplyPreviewProps {
  comment: SquareComment;
  onReply: (reply: SquareComment) => void;
  onViewAll: (comment: SquareComment) => void;
}

export function AskReplyPreview({ comment, onReply, onViewAll }: AskReplyPreviewProps) {
  const [expanded, setExpanded] = useState(false);
  const repliesQuery = useCommentReplies(comment.id, expanded);
  const previewReplies = useMemo(() => {
    if (expanded && repliesQuery.replies.length > 0) {
      return repliesQuery.replies.slice(0, ASK_REPLY_EXPAND_COUNT);
    }
    return comment.topReplies.slice(0, TOP_REPLIES_PREVIEW_COUNT);
  }, [comment.topReplies, expanded, repliesQuery.replies]);
  const parentNameMap = useMemo(() => {
    const map = new Map<string, string>();
    map.set(comment.id, getAuthorDisplayName(comment.author));
    previewReplies.forEach((reply) => {
      map.set(reply.id, getAuthorDisplayName(reply.author));
    });
    return map;
  }, [comment.author, comment.id, previewReplies]);

  if (previewReplies.length === 0 && comment.replyCount === 0) {
    return null;
  }

  const handleMore = () => {
    if (!expanded && comment.replyCount > TOP_REPLIES_PREVIEW_COUNT) {
      setExpanded(true);
      return;
    }
    onViewAll(comment);
  };

  const showMore = comment.replyCount > previewReplies.length;

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
      {showMore ? (
        <Pressable onPress={handleMore}>
          <Text style={styles.viewMore}>
            {expanded
              ? `查看 ${comment.replyCount} 条回复`
              : ASK_VIEW_ALL_REPLIES_LABEL}
          </Text>
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
