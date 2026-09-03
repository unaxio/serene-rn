import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { APP_TEXT_COLOR } from '@/constants/Colors';
import {
  ACCENT_COLOR,
  COMMENT_COMPOSER_PLACEHOLDER,
  PLACEHOLDER_TEXT_COLOR,
  SEARCH_BAR_BG,
} from '@/src/features/square/constants';

interface ShareCompactComposerProps {
  value: string;
  isSubmitting: boolean;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
}

const COMMENT_MAX_LENGTH = 500;
const COMPOSER_INPUT_HEIGHT = 34;
const COMPOSER_SEND_HEIGHT = 32;

export function ShareCompactComposer({
  value,
  isSubmitting,
  onChangeText,
  onSubmit,
}: ShareCompactComposerProps) {
  const canSend = value.trim().length > 0 && !isSubmitting;
  return (
    <View style={styles.composer}>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={COMMENT_COMPOSER_PLACEHOLDER}
        placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
        maxLength={COMMENT_MAX_LENGTH}
        editable={!isSubmitting}
        returnKeyType="send"
        onSubmitEditing={onSubmit}
      />
      <Pressable
        style={[styles.send, !canSend && styles.sendDisabled]}
        disabled={!canSend}
        onPress={onSubmit}>
        <Text style={styles.sendText}>发送</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  composer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
  },
  input: {
    flex: 1,
    minHeight: COMPOSER_INPUT_HEIGHT,
    borderRadius: COMPOSER_INPUT_HEIGHT / 2,
    backgroundColor: SEARCH_BAR_BG,
    paddingHorizontal: 12,
    fontSize: 13,
    color: APP_TEXT_COLOR,
  },
  send: {
    height: COMPOSER_SEND_HEIGHT,
    paddingHorizontal: 12,
    borderRadius: COMPOSER_SEND_HEIGHT / 2,
    backgroundColor: ACCENT_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendDisabled: {
    opacity: 0.45,
  },
  sendText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
