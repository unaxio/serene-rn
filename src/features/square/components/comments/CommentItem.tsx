import { memo, useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { APP_TEXT_COLOR } from '@/constants/Colors';
import { SquareUserAvatar } from '@/src/features/square/components/SquareUserAvatar';
import { CommentActionButton } from '@/src/features/square/components/comments/CommentActionButton';
import { CommentReplyPreviewBox } from '@/src/features/square/components/comments/CommentReplyPreviewBox';
import { MUTED_TEXT_COLOR } from '@/src/features/square/constants';
import type { SquareComment } from '@/src/features/square/types';
import { showCommentActionMenu } from '@/src/features/square/utils/commentActionMenu';
import { getAuthorDisplayName } from '@/src/features/square/utils/displayAuthor';
import { formatRelativeTime } from '@/src/features/square/utils/formatRelativeTime';

interface CommentItemProps {
  comment: SquareComment;
  enableCollect?: boolean;
  parentReplyName?: string | null;
  onResonate: (comment: SquareComment) => void;
  onCollect?: (comment: SquareComment) => void;
  onReply: (comment: SquareComment) => void;
  onViewReplies?: (comment: SquareComment) => void;
}

const LONG_PRESS_DELAY_MS = 350;
const AVATAR_SIZE = 36;

function CommentItemComponent({
  comment,
  enableCollect = false,
  parentReplyName,
  onResonate,
  onCollect,
  onReply,
  onViewReplies,
}: CommentItemProps) {
  const handleLongPress = useCallback(() => {
    showCommentActionMenu(comment.content);
  }, [comment.content]);

  return (
    <Pressable onLongPress={handleLongPress} delayLongPress={LONG_PRESS_DELAY_MS} style={styles.item}>
      <SquareUserAvatar author={comment.author} size={AVATAR_SIZE} />
      <View style={styles.body}>
        <Text style={styles.name}>
          {getAuthorDisplayName(comment.author)}
          {parentReplyName ? (
            <Text style={styles.replyHint}>  回复 @{parentReplyName}</Text>
          ) : null}
        </Text>
        <Text style={styles.content}>{comment.content}</Text>
        <Text style={styles.time}>{formatRelativeTime(comment.createdAt)}</Text>
        <View style={styles.actions}>
          <CommentActionButton
            icon={{ ios: 'heart', android: 'favorite_border', web: 'favorite_border' }}
            label={String(comment.resonateCount)}
            active={comment.isResonated}
            onPress={() => onResonate(comment)}
          />
          {enableCollect && onCollect ? (
            <CommentActionButton
              icon={{ ios: 'star', android: 'star_border', web: 'star_border' }}
              label={String(comment.collectCount)}
              active={comment.isCollected}
              onPress={() => onCollect(comment)}
            />
          ) : null}
          <CommentActionButton
            icon={{ ios: 'arrowshape.turn.up.left', android: 'reply', web: 'reply' }}
            label="回复"
            onPress={() => onReply(comment)}
          />
        </View>
        <CommentReplyPreviewBox comment={comment} onViewReplies={onViewReplies} />
      </View>
    </Pressable>
  );
}

export const CommentItem = memo(CommentItemComponent);

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  body: {
    flex: 1,
    gap: 4,
  },
  name: {
    fontSize: 13,
    fontWeight: '600',
    color: APP_TEXT_COLOR,
  },
  replyHint: {
    fontWeight: '400',
    color: MUTED_TEXT_COLOR,
  },
  content: {
    fontSize: 14,
    lineHeight: 20,
    color: APP_TEXT_COLOR,
  },
  time: {
    fontSize: 11,
    color: MUTED_TEXT_COLOR,
  },
  actions: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 4,
  },
});
