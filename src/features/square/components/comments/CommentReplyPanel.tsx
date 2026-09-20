import { FlashList } from '@shopify/flash-list';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { PercentSheetModal } from '@/src/components/PercentSheetModal';
import {
  CommentComposer,
  type CommentComposerHandle,
} from '@/src/features/square/components/comments/CommentComposer';
import { CommentItem } from '@/src/features/square/components/comments/CommentItem';
import { CommentReplyRoot } from '@/src/features/square/components/comments/CommentReplyRoot';
import {
  COMMENT_REPLIES_TITLE,
  COMMENT_SHEET_HEIGHT_RATIO,
  COMPOSER_FOCUS_DELAY_MS,
  MUTED_TEXT_COLOR,
} from '@/src/features/square/constants';
import { useCommentReplies } from '@/src/features/square/hooks/useCommentReplies';
import type { CommentMention, SquareComment } from '@/src/features/square/types';
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
  onSubmitReply: (parentId: string, content: string, mentions?: CommentMention[]) => Promise<boolean>;
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
    async (content: string, mentions: CommentMention[] = []) => {
      const ok = await onSubmitReply(replyTo.id, content, mentions);
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
        scrollIntoView={false}
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
    <PercentSheetModal
      visible={visible}
      title={COMMENT_REPLIES_TITLE}
      heightRatio={COMMENT_SHEET_HEIGHT_RATIO}
      onBack={onClose}>
      <View style={styles.root}>
        <FlashList
          data={replies}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListHeaderComponent={
            <CommentReplyRoot
              root={root}
              replyCount={Math.max(root.replyCount, replies.length)}
              enableCollect={enableCollect}
              enableFlower={enableFlower}
              isLoading={isLoading}
              isError={isError}
              onResonate={onResonate}
              onCollect={onCollect}
              onFlower={onFlower}
              onReply={handleReply}
            />
          }
          ListEmptyComponent={
            isLoading || isError ? null : <Text style={styles.empty}>暂无回复</Text>
          }
        />
        <CommentComposer
          ref={composerRef}
          placeholder={getReplyPlaceholder(replyTo.author)}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
        />
      </View>
    </PercentSheetModal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  list: {
    paddingBottom: 12,
  },
  empty: {
    textAlign: 'center',
    color: MUTED_TEXT_COLOR,
    fontSize: 13,
    paddingVertical: 12,
  },
});
