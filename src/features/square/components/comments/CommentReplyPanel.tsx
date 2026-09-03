import { FlashList } from '@shopify/flash-list';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { FullScreenModal } from '@/src/components/FullScreenModal';
import { CommentComposer } from '@/src/features/square/components/comments/CommentComposer';
import { CommentItem } from '@/src/features/square/components/comments/CommentItem';
import { ACCENT_COLOR, MUTED_TEXT_COLOR } from '@/src/features/square/constants';
import { useCommentReplies } from '@/src/features/square/hooks/useCommentReplies';
import type { SquareComment } from '@/src/features/square/types';
import { getAuthorDisplayName } from '@/src/features/square/utils/displayAuthor';

interface CommentReplyPanelProps {
  visible: boolean;
  root: SquareComment;
  isSubmitting: boolean;
  onClose: () => void;
  onResonate: (comment: SquareComment) => void;
  onSubmitReply: (parentId: string, content: string) => Promise<boolean>;
}

export function CommentReplyPanel({
  visible,
  root,
  isSubmitting,
  onClose,
  onResonate,
  onSubmitReply,
}: CommentReplyPanelProps) {
  const { replies, isLoading, isError } = useCommentReplies(root.id, visible);
  const [replyTo, setReplyTo] = useState<SquareComment>(root);

  useEffect(() => {
    setReplyTo(root);
  }, [root]);

  const parentNameMap = useMemo(() => {
    const map = new Map<string, string>();
    map.set(root.id, getAuthorDisplayName(root.author));
    replies.forEach((item) => {
      map.set(item.id, getAuthorDisplayName(item.author));
    });
    return map;
  }, [replies, root]);

  const handleSubmit = useCallback(
    async (content: string) => {
      const ok = await onSubmitReply(replyTo.id, content);
      if (ok) {
        setReplyTo(root);
      }
      return ok;
    },
    [onSubmitReply, replyTo.id, root],
  );

  const renderItem = useCallback(
    ({ item }: { item: SquareComment }) => (
      <CommentItem
        comment={item}
        parentReplyName={resolveParentReplyName(item, parentNameMap)}
        onResonate={onResonate}
        onReply={setReplyTo}
      />
    ),
    [onResonate, parentNameMap],
  );

  return (
    <FullScreenModal visible={visible} title="全部回复" onBack={onClose}>
      <View style={styles.root}>
        <CommentItem
          comment={{ ...root, topReplies: [] }}
          onResonate={onResonate}
          onReply={setReplyTo}
        />
        {isLoading ? (
          <ActivityIndicator style={styles.status} color={ACCENT_COLOR} />
        ) : null}
        {isError ? <Text style={styles.error}>回复加载失败</Text> : null}
        <FlashList
          data={replies}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
        />
        <CommentComposer
          placeholder={`回复 ${getAuthorDisplayName(replyTo.author)}`}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
        />
      </View>
    </FullScreenModal>
  );
}

function resolveParentReplyName(
  item: SquareComment,
  parentNameMap: Map<string, string>,
): string | null {
  if (!item.parentId) {
    return null;
  }
  if (item.parentAuthor) {
    return getAuthorDisplayName(item.parentAuthor);
  }
  return parentNameMap.get(item.parentId) ?? null;
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  list: {
    paddingBottom: 12,
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
