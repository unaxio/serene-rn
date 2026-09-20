import { forwardRef, useImperativeHandle } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { KeyboardStickyView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { APP_TEXT_COLOR } from '@/constants/Colors';
import { CommentMentionPicker } from '@/src/features/square/components/comments/CommentMentionPicker';
import { CommentMentionText } from '@/src/features/square/components/comments/CommentMentionText';
import { commentComposerStyles as styles } from '@/src/features/square/components/comments/commentComposerStyles';
import { PLACEHOLDER_TEXT_COLOR } from '@/src/features/square/constants';
import { useCommentComposerDraft } from '@/src/features/square/hooks/useCommentComposerDraft';
import type { CommentMention } from '@/src/features/square/types';

export interface CommentComposerHandle {
  focus: () => void;
}

interface CommentComposerProps {
  placeholder: string;
  isSubmitting: boolean;
  onSubmit: (content: string, mentions: CommentMention[]) => Promise<boolean>;
  includeSafeArea?: boolean;
  sticky?: boolean;
}

const MAX_COMMENT_LENGTH = 500;
const COMPOSER_MIN_BOTTOM = 8;

export const CommentComposer = forwardRef<CommentComposerHandle, CommentComposerProps>(
  function CommentComposer(
    { placeholder, isSubmitting, onSubmit, includeSafeArea = true, sticky = true },
    ref,
  ) {
    const insets = useSafeAreaInsets();
    const draft = useCommentComposerDraft(isSubmitting, onSubmit);
    const canSend = draft.value.trim().length > 0 && !isSubmitting;
    const bottomInset = sticky && includeSafeArea
      ? Math.max(insets.bottom, COMPOSER_MIN_BOTTOM)
      : sticky
        ? COMPOSER_MIN_BOTTOM
        : 0;

    useImperativeHandle(ref, () => ({
      focus: () => {
        draft.inputRef.current?.focus();
      },
    }));

    const bar = (
      <View style={[styles.wrap, !sticky && styles.inlineWrap, { paddingBottom: bottomInset || undefined }]}>
        {draft.activeQuery !== null ? (
          <CommentMentionPicker query={draft.activeQuery} onSelect={draft.handleSelectUser} />
        ) : null}
        <View style={styles.bar}>
          <View style={styles.inputWrap}>
            <TextInput
              ref={draft.inputRef}
              style={[styles.input, !sticky && styles.inlineInput, draft.mentions.length > 0 && styles.inputHidden]}
              value={draft.value}
              onChangeText={draft.handleChangeText}
              selection={draft.forcedSelection ?? undefined}
              onSelectionChange={(event) => draft.handleSelectionChange(event.nativeEvent.selection)}
              placeholder={draft.mentions.length > 0 ? undefined : placeholder}
              placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
              maxLength={MAX_COMMENT_LENGTH}
              editable={!isSubmitting}
              cursorColor={APP_TEXT_COLOR}
              returnKeyType="send"
              submitBehavior="submit"
              onSubmitEditing={() => {
                void draft.handleSubmit();
              }}
            />
            {draft.mentions.length > 0 ? (
              <View style={styles.overlay} pointerEvents="none">
                <CommentMentionText
                  content={draft.value}
                  mentions={draft.mentions}
                  style={styles.overlayText}
                />
              </View>
            ) : null}
          </View>
          <Pressable
            style={[styles.send, !canSend && styles.sendDisabled]}
            disabled={!canSend}
            onPress={() => {
              void draft.handleSubmit();
            }}>
            <Text style={styles.sendText}>发送</Text>
          </Pressable>
        </View>
      </View>
    );

    if (!sticky) {
      return bar;
    }

    return <KeyboardStickyView>{bar}</KeyboardStickyView>;
  },
);
