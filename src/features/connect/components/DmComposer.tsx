import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import {
  CONNECT_AI_EMOJIS,
  CONNECT_DM_TEXT_MAX,
} from '@/src/features/connect/constants';
import type { DmQuote } from '@/src/features/connect/types';
import { ACCENT_COLOR, PLACEHOLDER_TEXT_COLOR } from '@/src/features/square/constants';
import { showToast } from '@/src/utils/toast';

interface DmComposerProps {
  blocked: boolean;
  inputHint: string;
  quote: DmQuote | null;
  onClearQuote: () => void;
  onSendText: (content: string) => void;
}

const INPUT_HEIGHT = 36;
const INPUT_RADIUS = 18;
const INPUT_FONT_SIZE = 15;
const INPUT_LINE_HEIGHT = 20;
const INPUT_PADDING_H = 12;
const INPUT_PADDING_V = (INPUT_HEIGHT - INPUT_LINE_HEIGHT) / 2;

export function DmComposer({
  blocked,
  inputHint,
  quote,
  onClearQuote,
  onSendText,
}: DmComposerProps) {
  const [text, setText] = useState('');
  const [emojiOpen, setEmojiOpen] = useState(false);

  const handleSend = useCallback(() => {
    const content = text.trim();
    if (blocked || content.length === 0) {
      return;
    }
    if (content.length > CONNECT_DM_TEXT_MAX) {
      showToast(`最多 ${CONNECT_DM_TEXT_MAX} 字`);
      return;
    }
    onSendText(content);
    setText('');
  }, [blocked, onSendText, text]);

  return (
    <View style={styles.wrap}>
      {quote ? (
        <View style={styles.quote}>
          <Text numberOfLines={1} style={styles.quoteText}>
            {quote.summary}
          </Text>
          <Pressable onPress={onClearQuote}>
            <Text>✕</Text>
          </Pressable>
        </View>
      ) : null}
      {emojiOpen && !blocked ? (
        <View style={styles.emojis}>
          {CONNECT_AI_EMOJIS.map((emoji) => (
            <Pressable key={emoji} onPress={() => setText((current) => `${current}${emoji}`)}>
              <Text style={styles.emoji}>{emoji}</Text>
            </Pressable>
          ))}
        </View>
      ) : null}
      <View style={styles.row}>
        <Pressable disabled={blocked} onPress={() => setEmojiOpen((open) => !open)}>
          <Text style={styles.emoji}>😊</Text>
        </Pressable>
        <TextInput
          style={styles.input}
          editable={!blocked}
          value={text}
          placeholder={inputHint || '发消息'}
          placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
          onChangeText={setText}
          returnKeyType="send"
          submitBehavior="submit"
          onSubmitEditing={handleSend}
        />
        <Pressable style={styles.send} disabled={blocked} onPress={handleSend}>
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
    padding: 8,
    gap: 8,
  },
  quote: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 8 },
  quoteText: { flex: 1, color: '#64748B' },
  emojis: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  emoji: { fontSize: 22 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  input: {
    flex: 1,
    height: INPUT_HEIGHT,
    margin: 0,
    borderRadius: INPUT_RADIUS,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: INPUT_PADDING_H,
    paddingVertical: INPUT_PADDING_V,
    fontSize: INPUT_FONT_SIZE,
    lineHeight: INPUT_LINE_HEIGHT,
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
  send: {
    height: INPUT_HEIGHT,
    paddingHorizontal: INPUT_PADDING_H,
    borderRadius: INPUT_RADIUS,
    backgroundColor: ACCENT_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendText: { color: '#FFFFFF', fontWeight: '700' },
});
