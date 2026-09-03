import { FlashList } from '@shopify/flash-list';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { FullScreenModal } from '@/src/components/FullScreenModal';
import {
  CommentComposer,
  type CommentComposerHandle,
} from '@/src/features/square/components/comments/CommentComposer';
import { CommentItem } from '@/src/features/square/components/comments/CommentItem';
import { ACCENT_COLOR, COMPOSER_FOCUS_DELAY_MS, MUTED_TEXT_COLOR } from '@/src/features/square/constants';
import { useCommentReplies } from '@/src/features/square/hooks/useCommentReplies';
import type { SquareComment } from '@/src/features/square/types';
import { getAuthorDisplayName, getReplyPlaceholder } from '@/src/features/square/utils/displayAuthor';
import { resolveParentReplyName } from '@/src/features/square/utils/resolveParentReplyName';

interface CommentReplyPanelProps {
  visible: boolean;
  root: SquareComment;
  isSubmitting: boolean;
  enableCollect?: boolean;
  enableFlower?: boolean;
  onClose: () => void;
  onResonate: (comment: SquareComment) => void;
  onCollect?: (comment: SquareComment) => void;
  onFlower?: (comment: SquareComment) => void;
  onSubmitReply: (parentId: string, content: string) => Promise<boolean>;
}

export function CommentReplyPanel({
  visible,
  root,
  isSubmitting,
  enableCollect = false,
  enableFlower = false,
  onClose,
  onResonate,
  onCollect,
  onFlower,
  onSubmitReply,
}: CommentReplyPanelProps) {
  const { replies, isLoading, isError } = useCommentReplies(root.id, visible);
  const [replyTo, setReplyTo] = useState<SquareComment>(root);
  const composerRef = useRef<CommentComposerHandle>(null);

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

  const handleReply = useCallback((comment: SquareComment) => {
    setReplyTo(comment);
    setTimeout(() => composerRef.current?.focus(), COMPOSER_FOCUS_DELAY_MS);
  }, []);

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
        enableFlower={enableFlower}
        parentReplyName={resolveParentReplyName(item, parentNameMap)}
        onResonate={onResonate}
        onFlower={onFlower}
        onReply={handleReply}
      />
    ),
    [enableFlower, handleReply, onFlower, onResonate, parentNameMap],
  );

  return (
    <FullScreenModal visible={visible} title="全部回复" onBack={onClose}>
      <View style={styles.root}>
        <CommentItem
          comment={{ ...root, topReplies: [] }}
          enableCollect={enableCollect}
          enableFlower={enableFlower}
          onResonate={onResonate}
          onCollect={onCollect}
          onFlower={onFlower}
          onReply={handleReply}
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
          ListEmptyComponent={
            isLoading || isError ? null : <Text style={styles.error}>暂无回复</Text>
          }
        />
        <CommentComposer
          ref={composerRef}
          placeholder={getReplyPlaceholder(replyTo.author)}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
        />
      </View>
    </FullScreenModal>
  );
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
