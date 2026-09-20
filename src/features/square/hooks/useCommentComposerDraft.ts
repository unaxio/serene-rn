import { useCallback, useRef, useState } from 'react';
import type { TextInput } from 'react-native';

import type { FollowUser } from '@/src/features/follow/types';
import { useRequireAuth } from '@/src/features/square/hooks/useRequireAuth';
import type { CommentMention } from '@/src/features/square/types';
import {
  applyCommentTextChange,
  findActiveMentionQuery,
  insertCommentMention,
  trimCommentDraft,
} from '@/src/features/square/utils/commentMention';

interface TextSelection {
  start: number;
  end: number;
}

interface CommentDraft {
  text: string;
  mentions: CommentMention[];
}

export function useCommentComposerDraft(
  isSubmitting: boolean,
  onSubmit: (content: string, mentions: CommentMention[]) => Promise<boolean>,
) {
  const requireAuth = useRequireAuth();
  const inputRef = useRef<TextInput>(null);
  const draftRef = useRef<CommentDraft>({ text: '', mentions: [] });
  const [value, setValue] = useState('');
  const [mentions, setMentions] = useState<CommentMention[]>([]);
  const [cursor, setCursor] = useState(0);
  const [forcedSelection, setForcedSelection] = useState<TextSelection | null>(null);

  const commit = useCallback((text: string, nextMentions: CommentMention[], nextCursor: number) => {
    draftRef.current = { text, mentions: nextMentions };
    setValue(text);
    setMentions(nextMentions);
    setCursor(nextCursor);
    setForcedSelection({ start: nextCursor, end: nextCursor });
  }, []);

  const handleChangeText = useCallback((next: string) => {
    if (next === draftRef.current.text) {
      setForcedSelection(null);
      return;
    }
    const result = applyCommentTextChange(draftRef.current.text, next, draftRef.current.mentions);
    draftRef.current = { text: result.text, mentions: result.mentions };
    setValue(result.text);
    setMentions(result.mentions);
    setCursor(result.cursor);
    setForcedSelection(result.text === next ? null : { start: result.cursor, end: result.cursor });
  }, []);

  const handleSelectionChange = useCallback((selection: TextSelection) => {
    setCursor(selection.end);
    setForcedSelection(null);
  }, []);

  const handleSelectUser = useCallback(
    (user: FollowUser) => {
      const inserted = insertCommentMention(
        draftRef.current.text,
        cursor,
        draftRef.current.mentions,
        { userId: user.userId, nickName: user.nickName ?? user.username ?? '' },
      );
      if (!inserted) {
        return;
      }
      commit(inserted.text, inserted.mentions, inserted.cursor);
      inputRef.current?.focus();
    },
    [commit, cursor],
  );

  const handleSubmit = useCallback(async () => {
    const draft = trimCommentDraft(draftRef.current.text, draftRef.current.mentions);
    if (draft.content.length === 0 || isSubmitting || !requireAuth()) {
      return;
    }
    const ok = await onSubmit(draft.content, draft.mentions);
    if (ok) {
      commit('', [], 0);
    }
  }, [commit, isSubmitting, onSubmit, requireAuth]);

  return {
    inputRef,
    value,
    mentions,
    forcedSelection,
    activeQuery: findActiveMentionQuery(value, cursor, mentions),
    handleChangeText,
    handleSelectionChange,
    handleSelectUser,
    handleSubmit,
  };
}
