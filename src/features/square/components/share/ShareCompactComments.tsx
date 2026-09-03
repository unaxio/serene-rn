import { useCallback, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ShareCompactComposer } from '@/src/features/square/components/share/ShareCompactComposer';
import {
  ACCENT_COLOR,
  MUTED_TEXT_COLOR,
  SHARE_COLLAPSE_COMMENTS_LABEL,
  SHARE_COMPACT_COMMENT_COUNT,
  SHARE_EXPAND_COMMENTS_LABEL,
  SHARE_LOAD_MORE_COMMENTS_LABEL,
} from '@/src/features/square/constants';
import { useComments } from '@/src/features/square/hooks/useComments';
import {
  formatCompactCommentLine,
  toCompactCommentLines,
} from '@/src/features/square/utils/compactCommentLines';

interface ShareCompactCommentsProps {
  shareId: string;
  commentCount: number;
  expanded: boolean;
  showComposer: boolean;
  onToggleExpanded: () => void;
}

const EXPAND_HIT_SLOP = 6;

export function ShareCompactComments({
  shareId,
  commentCount,
  expanded,
  showComposer,
  onToggleExpanded,
}: ShareCompactCommentsProps) {
  const enabled = commentCount > 0 || showComposer || expanded;
  const comments = useComments({
    targetType: 'share',
    targetId: shareId,
    enabled,
  });
  const [draft, setDraft] = useState('');
  const lines = useMemo(
    () => toCompactCommentLines(comments.items),
    [comments.items],
  );
  const visibleLines = expanded ? lines : lines.slice(0, SHARE_COMPACT_COMMENT_COUNT);
  const hasHiddenLines = lines.length > SHARE_COMPACT_COMMENT_COUNT || comments.hasNextPage;

  const handleSend = useCallback(async () => {
    const trimmed = draft.trim();
    if (!trimmed || comments.isSubmitting) {
      return;
    }
    const result = await comments.submitComment(trimmed);
    if (result) {
      setDraft('');
    }
  }, [comments, draft]);

  if (!enabled) {
    return null;
  }

  return (
    <View style={styles.root}>
      {visibleLines.map((line) => (
        <Text key={line.id} style={styles.line} numberOfLines={expanded ? undefined : 2}>
          {formatCompactCommentLine(line)}
        </Text>
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
      {showComposer ? (
        <ShareCompactComposer
          value={draft}
          isSubmitting={comments.isSubmitting}
          onChangeText={setDraft}
          onSubmit={() => {
            void handleSend();
          }}
        />
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
