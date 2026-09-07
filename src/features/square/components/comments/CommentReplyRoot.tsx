import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { APP_TEXT_COLOR } from '@/constants/Colors';
import { CommentItem } from '@/src/features/square/components/comments/CommentItem';
import {
  ACCENT_COLOR,
  CARD_BORDER_COLOR,
  COMMENT_HORIZONTAL_PADDING,
  COMMENT_REPLIES_COUNT_PREFIX,
  COMMENT_ROOT_DIVIDER_HEIGHT,
  MUTED_TEXT_COLOR,
  SQUARE_PAGE_BG,
} from '@/src/features/square/constants';
import type { SquareComment } from '@/src/features/square/types';

interface CommentReplyRootProps {
  root: SquareComment;
  replyCount: number;
  enableCollect: boolean;
  enableFlower: boolean;
  isLoading: boolean;
  isError: boolean;
  onResonate: (comment: SquareComment) => void;
  onCollect?: (comment: SquareComment) => void;
  onFlower?: (comment: SquareComment) => void;
  onReply: (comment: SquareComment) => void;
}

const COUNT_TITLE_PADDING_TOP = 12;
const COUNT_TITLE_PADDING_BOTTOM = 4;
const COUNT_TITLE_FONT_SIZE = 13;

export function CommentReplyRoot({
  root,
  replyCount,
  enableCollect,
  enableFlower,
  isLoading,
  isError,
  onResonate,
  onCollect,
  onFlower,
  onReply,
}: CommentReplyRootProps) {
  return (
    <View>
      <CommentItem
        comment={{ ...root, topReplies: [] }}
        enableCollect={enableCollect}
        enableFlower={enableFlower}
        onResonate={onResonate}
        onCollect={onCollect}
        onFlower={onFlower}
        onReply={onReply}
      />
      <View style={styles.divider} />
      <Text style={styles.countTitle}>
        {COMMENT_REPLIES_COUNT_PREFIX}
        {replyCount}
      </Text>
      {isLoading ? (
        <ActivityIndicator style={styles.status} color={ACCENT_COLOR} />
      ) : null}
      {isError ? <Text style={styles.error}>回复加载失败</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  divider: {
    height: COMMENT_ROOT_DIVIDER_HEIGHT,
    backgroundColor: SQUARE_PAGE_BG,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: CARD_BORDER_COLOR,
  },
  countTitle: {
    paddingHorizontal: COMMENT_HORIZONTAL_PADDING,
    paddingTop: COUNT_TITLE_PADDING_TOP,
    paddingBottom: COUNT_TITLE_PADDING_BOTTOM,
    fontSize: COUNT_TITLE_FONT_SIZE,
    fontWeight: '600',
    color: APP_TEXT_COLOR,
    textAlign: 'left',
  },
  status: {
    paddingVertical: 16,
  },
  error: {
    textAlign: 'center',
    color: MUTED_TEXT_COLOR,
    fontSize: 13,
    paddingVertical: 12,
  },
});
