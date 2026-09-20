import { memo, useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { APP_TEXT_COLOR } from '@/constants/Colors';
import { SquareUserAvatar } from '@/src/features/square/components/SquareUserAvatar';
import { CommentActionButton } from '@/src/features/square/components/comments/CommentActionButton';
import { CommentHighlight } from '@/src/features/square/components/comments/CommentHighlight';
import { CommentMentionText } from '@/src/features/square/components/comments/CommentMentionText';
import { CommentReplyPreviewBox } from '@/src/features/square/components/comments/CommentReplyPreviewBox';
import { MUTED_TEXT_COLOR, COMMENT_LONG_PRESS_DELAY_MS } from '@/src/features/square/constants';
import type { SquareComment } from '@/src/features/square/types';
import { showCommentActionMenu } from '@/src/features/square/utils/commentActionMenu';
import { getAuthorDisplayName } from '@/src/features/square/utils/displayAuthor';
import { formatRelativeTime } from '@/src/features/square/utils/formatRelativeTime';

interface CommentItemProps {
  comment: SquareComment;
  enableCollect?: boolean;
  enableFlower?: boolean;
  showReplyPreview?: boolean;
  scrollIntoView?: boolean;
  parentReplyName?: string | null;
  onResonate: (comment: SquareComment) => void;
  onCollect?: (comment: SquareComment) => void;
  onFlower?: (comment: SquareComment) => void;
  onReply: (comment: SquareComment) => void;
  onViewReplies?: (comment: SquareComment) => void;
}

const AVATAR_SIZE = 36;
const AVATAR_GAP = 10;
const ACTION_LEFT_OFFSET = AVATAR_SIZE + AVATAR_GAP;

function CommentItemComponent({
  comment,
  enableCollect = false,
  enableFlower = false,
  showReplyPreview = true,
  scrollIntoView = true,
  parentReplyName,
  onResonate,
  onCollect,
  onFlower,
  onReply,
  onViewReplies,
}: CommentItemProps) {
  const handleLongPress = useCallback(() => {
    showCommentActionMenu(comment.content);
  }, [comment.content]);

  return (
    <CommentHighlight commentId={comment.id} scrollIntoView={scrollIntoView}>
    <View style={styles.item}>
      <Pressable
        style={styles.header}
        onPress={() => onReply(comment)}
        onLongPress={handleLongPress}
        delayLongPress={COMMENT_LONG_PRESS_DELAY_MS}>
        <SquareUserAvatar author={comment.author} size={AVATAR_SIZE} />
        <View style={styles.body}>
          <Text style={styles.name}>
            {getAuthorDisplayName(comment.author)}
            {parentReplyName ? (
              <Text style={styles.replyHint}> 回复 {parentReplyName}</Text>
            ) : null}
          </Text>
          <CommentMentionText content={comment.content} mentions={comment.mentions} style={styles.content} />
          <Text style={styles.time}>{formatRelativeTime(comment.createdAt)}</Text>
        </View>
      </Pressable>
      <View style={styles.footer}>
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
          {enableFlower && onFlower ? (
            <CommentActionButton
              icon={{ ios: 'leaf', android: 'local_florist', web: 'local_florist' }}
              label={String(comment.flowerCount)}
              active={comment.isFlowered}
              onPress={() => onFlower(comment)}
            />
          ) : null}
        </View>
        {showReplyPreview ? (
          <CommentReplyPreviewBox
            comment={comment}
            onReply={onReply}
            onViewReplies={onViewReplies}
          />
        ) : null}
      </View>
    </View>
    </CommentHighlight>
  );
}

export const CommentItem = memo(CommentItemComponent);

const styles = StyleSheet.create({
  item: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  header: {
    flexDirection: 'row',
    gap: AVATAR_GAP,
  },
  body: {
    flex: 1,
    gap: 4,
  },
  footer: {
    marginLeft: ACTION_LEFT_OFFSET,
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
