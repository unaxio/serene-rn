import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CONNECT_AI_EMOJIS, CONNECT_DM_TEXT_MAX } from '@/src/features/connect/constants';
import { ACCENT_COLOR, PLACEHOLDER_TEXT_COLOR } from '@/src/features/square/constants';
import { showToast } from '@/src/utils/toast';

interface AiChatComposerProps {
  disabled: boolean;
  onSend: (content: string) => void;
}

const COMPOSER_HEIGHT = 36;
const COMPOSER_FONT_SIZE = 15;
const COMPOSER_LINE_HEIGHT = 20;
const COMPOSER_RADIUS = 18;
const COMPOSER_PADDING_H = 12;
const COMPOSER_PADDING_V = (COMPOSER_HEIGHT - COMPOSER_LINE_HEIGHT) / 2;
/** Web 的 insets.bottom 为 0，与顶栏一样在安全区之外再留一段 */
const MIN_BOTTOM_INSET = 12;

export function AiChatComposer({ disabled, onSend }: AiChatComposerProps) {
  const insets = useSafeAreaInsets();
  const [text, setText] = useState('');
  const [emojiOpen, setEmojiOpen] = useState(false);

  const handleSend = useCallback(() => {
    const content = text.trim();
    if (!content || disabled) {
      return;
    }
    if (content.length > CONNECT_DM_TEXT_MAX) {
      showToast(`最多 ${CONNECT_DM_TEXT_MAX} 字`);
      return;
    }
    onSend(content);
    setText('');
    setEmojiOpen(false);
  }, [disabled, onSend, text]);

  return (
    <View style={[styles.wrap, { paddingBottom: insets.bottom + MIN_BOTTOM_INSET }]}>
      {emojiOpen ? (
        <View style={styles.emojis}>
          {CONNECT_AI_EMOJIS.map((emoji) => (
            <Pressable key={emoji} onPress={() => setText((current) => `${current}${emoji}`)}>
              <Text style={styles.emoji}>{emoji}</Text>
            </Pressable>
          ))}
        </View>
      ) : null}
      <View style={styles.row}>
        <Pressable
          style={styles.emojiButton}
          onPress={() => setEmojiOpen((open) => !open)}
          disabled={disabled}>
          <Text style={styles.emoji}>😊</Text>
        </Pressable>
        <TextInput
          style={styles.input}
          value={text}
          editable={!disabled}
          placeholder={disabled ? '正在回复…' : '说点什么'}
          placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
          onChangeText={setText}
          returnKeyType="send"
          submitBehavior="submit"
          onSubmitEditing={handleSend}
        />
        <Pressable style={styles.send} disabled={disabled} onPress={handleSend}>
          <Text style={styles.sendText}>发送</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  emojis: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  emojiButton: {
    height: COMPOSER_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: { fontSize: 22, lineHeight: 24 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  input: {
    flex: 1,
    height: COMPOSER_HEIGHT,
    margin: 0,
    borderRadius: COMPOSER_RADIUS,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: COMPOSER_PADDING_H,
    paddingVertical: COMPOSER_PADDING_V,
    fontSize: COMPOSER_FONT_SIZE,
    lineHeight: COMPOSER_LINE_HEIGHT,
    color: '#0F172A',
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
  send: {
    height: COMPOSER_HEIGHT,
    paddingHorizontal: COMPOSER_PADDING_H,
    borderRadius: COMPOSER_RADIUS,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ACCENT_COLOR,
  },
  sendText: { color: '#FFFFFF', fontWeight: '700' },
});
