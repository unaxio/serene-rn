import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { KeyboardStickyView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { APP_TEXT_COLOR } from '@/constants/Colors';
import {
  ACCENT_COLOR,
  PLACEHOLDER_TEXT_COLOR,
} from '@/src/features/square/constants';
import { useRequireAuth } from '@/src/features/square/hooks/useRequireAuth';

interface CommentComposerProps {
  placeholder: string;
  isSubmitting: boolean;
  onSubmit: (content: string) => Promise<boolean>;
}

const MAX_COMMENT_LENGTH = 500;
const COMPOSER_MIN_BOTTOM = 8;

export function CommentComposer({
  placeholder,
  isSubmitting,
  onSubmit,
}: CommentComposerProps) {
  const insets = useSafeAreaInsets();
  const requireAuth = useRequireAuth();
  const [value, setValue] = useState('');

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

  return (
    <KeyboardStickyView>
      <View
        style={[
          styles.bar,
          { paddingBottom: Math.max(insets.bottom, COMPOSER_MIN_BOTTOM) },
        ]}>
        <TextInput
          style={styles.input}
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
    </KeyboardStickyView>
  );
}

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
