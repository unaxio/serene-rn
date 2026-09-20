import { useCallback, useEffect, useRef, useState } from 'react';
import { Keyboard, Platform } from 'react-native';

import type { CommentComposerHandle } from '@/src/features/square/components/comments/CommentComposer';
import type { ShareInlineComposer } from '@/src/features/square/components/share/ShareCompactComments';
import {
  COMMENT_COMPOSER_PLACEHOLDER,
  COMPOSER_FOCUS_DELAY_MS,
  COMPOSER_OPEN_GUARD_MS,
} from '@/src/features/square/constants';
import { useComments } from '@/src/features/square/hooks/useComments';
import { useRequireAuth } from '@/src/features/square/hooks/useRequireAuth';
import type { CommentMention, SquareComment } from '@/src/features/square/types';
import { getReplyPlaceholder } from '@/src/features/square/utils/displayAuthor';

interface ShareComposerTarget {
  shareId: string;
  replyTo: SquareComment | null;
}

export function useShareComposer() {
  const requireAuth = useRequireAuth();
  const [target, setTarget] = useState<ShareComposerTarget | null>(null);
  const composerRef = useRef<CommentComposerHandle>(null);
  const openedAtRef = useRef(0);

  const comments = useComments({
    targetType: 'share',
    targetId: target?.shareId ?? '',
    enabled: Boolean(target),
  });

  const open = useCallback(
    (shareId: string, replyTo: SquareComment | null = null) => {
      if (!requireAuth()) {
        return;
      }
      openedAtRef.current = Date.now();
      setTarget({ shareId, replyTo });
    },
    [requireAuth],
  );

  useEffect(() => {
    if (!target) {
      return;
    }
    const timer = setTimeout(() => composerRef.current?.focus(), COMPOSER_FOCUS_DELAY_MS);
    return () => clearTimeout(timer);
  }, [target]);

  useEffect(() => {
    if (!target || Platform.OS === 'web') {
      return;
    }
    const sub = Keyboard.addListener('keyboardDidHide', () => {
      if (Date.now() - openedAtRef.current < COMPOSER_OPEN_GUARD_MS) {
        return;
      }
      setTarget(null);
    });
    return () => sub.remove();
  }, [target]);

  const submit = useCallback(
    async (content: string, mentions: CommentMention[] = []) => {
      if (!target) {
        return false;
      }
      const result = target.replyTo
        ? await comments.submitReply(target.replyTo.rootId, target.replyTo.id, content, mentions)
        : await comments.submitComment(content, mentions);
      if (!result) {
        return false;
      }
      setTarget(null);
      return true;
    },
    [comments, target],
  );

  const isSticky = Platform.OS !== 'web';

  const getInlineComposer = useCallback(
    (shareId: string): ShareInlineComposer | null => {
      if (isSticky || target?.shareId !== shareId) {
        return null;
      }
      return {
        replyToId: target.replyTo?.id ?? null,
        composerRef,
        placeholder: target.replyTo
          ? getReplyPlaceholder(target.replyTo.author)
          : COMMENT_COMPOSER_PLACEHOLDER,
        isSubmitting: comments.isSubmitting,
        onSubmit: submit,
      };
    },
    [comments.isSubmitting, isSticky, submit, target],
  );

  return {
    visible: target !== null,
    isSticky,
    composerRef,
    placeholder: target?.replyTo
      ? getReplyPlaceholder(target.replyTo.author)
      : COMMENT_COMPOSER_PLACEHOLDER,
    isSubmitting: comments.isSubmitting,
    open,
    submit,
    getInlineComposer,
  };
}
