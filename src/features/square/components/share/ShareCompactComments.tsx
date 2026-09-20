import { useMemo, type RefObject } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { CommentComposer, type CommentComposerHandle } from '@/src/features/square/components/comments/CommentComposer';
import { CommentHighlight } from '@/src/features/square/components/comments/CommentHighlight';
import { CommentMentionText } from '@/src/features/square/components/comments/CommentMentionText';
import {
  ACCENT_COLOR,
  MUTED_TEXT_COLOR,
  SHARE_COLLAPSE_COMMENTS_LABEL,
  SHARE_COMPACT_COMMENT_COUNT,
  SHARE_EXPAND_COMMENTS_LABEL,
  SHARE_LOAD_MORE_COMMENTS_LABEL,
} from '@/src/features/square/constants';
import { useComments } from '@/src/features/square/hooks/useComments';
import type { CommentMention, SquareComment } from '@/src/features/square/types';
import { usePendingCommentReply } from '@/src/features/square/utils/commentFocusCue';
import {
  toCompactCommentLines,
  type CompactCommentLine,
} from '@/src/features/square/utils/compactCommentLines';

export interface ShareInlineComposer {
  replyToId: string | null;
  composerRef: RefObject<CommentComposerHandle | null>;
  placeholder: string;
  isSubmitting: boolean;
  onSubmit: (content: string, mentions: CommentMention[]) => Promise<boolean>;
}

interface ShareCompactCommentsProps {
  shareId: string;
  commentCount: number;
  expanded: boolean;
  onToggleExpanded: () => void;
  onReply: (comment: SquareComment) => void;
  inlineComposer?: ShareInlineComposer | null;
  locateComments?: boolean;
}

const EXPAND_HIT_SLOP = 6;

function compactPrefix(line: CompactCommentLine): string {
  if (line.replyToName) {
    return `${line.authorName}：回复${line.replyToName}：`;
  }
  return `${line.authorName}：`;
}

export function ShareCompactComments({
  shareId,
  commentCount,
  expanded,
  onToggleExpanded,
  onReply,
  inlineComposer = null,
  locateComments = false,
}: ShareCompactCommentsProps) {
  const enabled = commentCount > 0 || expanded || inlineComposer !== null;
  const comments = useComments({
    targetType: 'share',
    targetId: shareId,
    enabled,
  });
  const lines = useMemo(
    () => toCompactCommentLines(comments.items),
    [comments.items],
  );
  const replyTargets = useMemo(
    () => comments.items.flatMap((item) => [item, ...item.topReplies]),
    [comments.items],
  );
  usePendingCommentReply(replyTargets, !locateComments || comments.isLoading, onReply);
  const visibleLines = expanded ? lines : lines.slice(0, SHARE_COMPACT_COMMENT_COUNT);
  const hasHiddenLines = lines.length > SHARE_COMPACT_COMMENT_COUNT || comments.hasNextPage;

  if (!enabled) {
    return null;
  }

  const inlineComposerNode = inlineComposer ? (
    <CommentComposer
      key={inlineComposer.replyToId ?? 'share'}
      ref={inlineComposer.composerRef}
      sticky={false}
      placeholder={inlineComposer.placeholder}
      isSubmitting={inlineComposer.isSubmitting}
      onSubmit={inlineComposer.onSubmit}
    />
  ) : null;

  return (
    <View style={styles.root}>
      {inlineComposer && inlineComposer.replyToId === null ? inlineComposerNode : null}
      {visibleLines.map((line) => (
        <View key={line.id}>
          {locateComments ? (
            <CommentHighlight commentId={line.id}>
              <Pressable onPress={() => onReply(line.comment)} hitSlop={EXPAND_HIT_SLOP}>
              <Text style={styles.line}>
                {compactPrefix(line)}
                <CommentMentionText content={line.content} mentions={line.comment.mentions} />
              </Text>
              </Pressable>
            </CommentHighlight>
          ) : (
            <Pressable onPress={() => onReply(line.comment)} hitSlop={EXPAND_HIT_SLOP}>
              <Text style={styles.line} numberOfLines={expanded ? undefined : 2}>
                {compactPrefix(line)}
                <CommentMentionText content={line.content} mentions={line.comment.mentions} />
              </Text>
            </Pressable>
          )}
          {inlineComposer && inlineComposer.replyToId === line.id ? inlineComposerNode : null}
        </View>
      ))}
      {hasHiddenLines ? (
        <Pressable onPress={onToggleExpanded} hitSlop={EXPAND_HIT_SLOP}>
          <Text style={styles.more}>
            {expanded ? SHARE_COLLAPSE_COMMENTS_LABEL : SHARE_EXPAND_COMMENTS_LABEL}
          </Text>
        </Pressable>
      ) : null}
      {expanded && comments.hasNextPage ? (
        <Pressable onPress={comments.loadMore} hitSlop={EXPAND_HIT_SLOP}>
          <Text style={styles.more}>{SHARE_LOAD_MORE_COMMENTS_LABEL}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: 4,
  },
  line: {
    fontSize: 13,
    lineHeight: 18,
    color: MUTED_TEXT_COLOR,
  },
  more: {
    fontSize: 12,
    fontWeight: '600',
    color: ACCENT_COLOR,
    marginTop: 2,
  },
});
