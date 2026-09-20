import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import {
  CONNECT_AI_EMOJIS,
  CONNECT_BLOCKED_HINT,
  CONNECT_DM_IMAGE_MAX,
  CONNECT_DM_TEXT_MAX,
} from '@/src/features/connect/constants';
import type { DmQuote } from '@/src/features/connect/types';
import { ACCENT_COLOR, PLACEHOLDER_TEXT_COLOR } from '@/src/features/square/constants';
import { pickSquareImages } from '@/src/features/square/utils/pickSquareImage';
import { showToast } from '@/src/utils/toast';

interface DmComposerProps {
  blocked: boolean;
  quote: DmQuote | null;
  onClearQuote: () => void;
  onSendText: (content: string) => void;
  onPickImages: () => void;
}

export function DmComposer({
  blocked,
  quote,
  onClearQuote,
  onSendText,
  onPickImages,
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
        <Pressable disabled={blocked} onPress={onPickImages}>
          <Text style={styles.tool}>图</Text>
        </Pressable>
        <Pressable disabled={blocked} onPress={() => setEmojiOpen((open) => !open)}>
          <Text style={styles.emoji}>😊</Text>
        </Pressable>
        <TextInput
          style={styles.input}
          editable={!blocked}
          value={text}
          placeholder={blocked ? CONNECT_BLOCKED_HINT : '发消息'}
          placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
          onChangeText={setText}
          multiline
        />
        <Pressable style={styles.send} disabled={blocked} onPress={handleSend}>
          <Text style={styles.sendText}>发送</Text>
        </Pressable>
      </View>
    </View>
  );
}

export async function pickDmImages(): Promise<Awaited<ReturnType<typeof pickSquareImages>>> {
  return pickSquareImages(CONNECT_DM_IMAGE_MAX);
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
  row: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  tool: { fontSize: 16, color: ACCENT_COLOR, padding: 6 },
  input: {
    flex: 1,
    minHeight: 36,
    maxHeight: 96,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  send: {
    height: 36,
    paddingHorizontal: 12,
    borderRadius: 18,
    backgroundColor: ACCENT_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendText: { color: '#FFFFFF', fontWeight: '700' },
});
