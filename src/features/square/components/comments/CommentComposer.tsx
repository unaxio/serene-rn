import { forwardRef, useCallback, useImperativeHandle, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { KeyboardStickyView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { APP_TEXT_COLOR } from '@/constants/Colors';
import {
  ACCENT_COLOR,
  PLACEHOLDER_TEXT_COLOR,
} from '@/src/features/square/constants';
import { useRequireAuth } from '@/src/features/square/hooks/useRequireAuth';

export interface CommentComposerHandle {
  focus: () => void;
}

interface CommentComposerProps {
  placeholder: string;
  isSubmitting: boolean;
  onSubmit: (content: string) => Promise<boolean>;
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
    const requireAuth = useRequireAuth();
    const inputRef = useRef<TextInput>(null);
    const [value, setValue] = useState('');

    useImperativeHandle(ref, () => ({
      focus: () => {
        inputRef.current?.focus();
      },
    }));

    const handleSubmit = useCallback(async () => {
      const trimmed = value.trim();
      if (!trimmed || isSubmitting) {
        return;
      }
      if (!requireAuth()) {
        return;
      }
      const ok = await onSubmit(trimmed);
      if (ok) {
        setValue('');
      }
    }, [isSubmitting, onSubmit, requireAuth, value]);

    const canSend = value.trim().length > 0 && !isSubmitting;
    const bottomInset = sticky && includeSafeArea
      ? Math.max(insets.bottom, COMPOSER_MIN_BOTTOM)
      : sticky
        ? COMPOSER_MIN_BOTTOM
        : 0;

    const bar = (
      <View style={[styles.bar, !sticky && styles.inlineBar, { paddingBottom: bottomInset || undefined }]}>
        <TextInput
          ref={inputRef}
          style={[styles.input, !sticky && styles.inlineInput]}
          value={value}
          onChangeText={setValue}
          placeholder={placeholder}
          placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
          maxLength={MAX_COMMENT_LENGTH}
          editable={!isSubmitting}
          returnKeyType="send"
          onSubmitEditing={() => {
            void handleSubmit();
          }}
        />
        <Pressable
          style={[styles.send, !canSend && styles.sendDisabled]}
          disabled={!canSend}
          onPress={() => {
            void handleSubmit();
          }}>
          <Text style={styles.sendText}>发送</Text>
        </Pressable>
      </View>
    );

    if (!sticky) {
      return bar;
    }

    return <KeyboardStickyView>{bar}</KeyboardStickyView>;
  },
);

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E8E6F2',
    backgroundColor: '#FFFFFF',
  },
  inlineBar: {
    paddingHorizontal: 0,
    paddingTop: 6,
    borderTopWidth: 0,
    backgroundColor: 'transparent',
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 80,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 14,
    fontSize: 14,
    color: APP_TEXT_COLOR,
  },
  inlineInput: {
    minHeight: 34,
    fontSize: 13,
  },
  send: {
    height: 36,
    paddingHorizontal: 14,
    borderRadius: 18,
    backgroundColor: ACCENT_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendDisabled: {
    opacity: 0.45,
  },
  sendText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
