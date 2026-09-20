import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { CONNECT_AI_EMOJIS, CONNECT_DM_TEXT_MAX } from '@/src/features/connect/constants';
import { ACCENT_COLOR, PLACEHOLDER_TEXT_COLOR } from '@/src/features/square/constants';
import { showToast } from '@/src/utils/toast';

interface AiChatComposerProps {
  disabled: boolean;
  onSend: (content: string) => void;
}

export function AiChatComposer({ disabled, onSend }: AiChatComposerProps) {
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
    <View style={styles.wrap}>
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
        <Pressable onPress={() => setEmojiOpen((open) => !open)} disabled={disabled}>
          <Text style={styles.emoji}>😊</Text>
        </Pressable>
        <TextInput
          style={styles.input}
          value={text}
          editable={!disabled}
          placeholder={disabled ? '正在回复…' : '说点什么'}
          placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
          onChangeText={setText}
          multiline
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
  emoji: { fontSize: 22 },
  row: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  input: {
    flex: 1,
    minHeight: 36,
    maxHeight: 96,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: '#0F172A',
  },
  send: {
    height: 36,
    paddingHorizontal: 12,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ACCENT_COLOR,
  },
  sendText: { color: '#FFFFFF', fontWeight: '700' },
});
