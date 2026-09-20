import { Pressable, StyleSheet, Text } from 'react-native';

import { APP_TEXT_COLOR } from '@/constants/Colors';
import type { DmMessage } from '@/src/features/connect/types';
import { dmMessageText } from '@/src/features/connect/utils/dmMessageText';
import { MUTED_TEXT_COLOR } from '@/src/features/square/constants';

interface DmBubbleProps {
  message: DmMessage;
  mine: boolean;
  highlighted: boolean;
  onLongPress: (message: DmMessage) => void;
}

export function DmBubble({ message, mine, highlighted, onLongPress }: DmBubbleProps) {
  return (
    <Pressable
      onLongPress={() => onLongPress(message)}
      style={[styles.bubble, mine ? styles.mine : styles.theirs, highlighted && styles.hit]}>
      {message.quote ? (
        <Text style={styles.quote} numberOfLines={2}>
          {message.quote.missing ? '引用内容已不可见' : `${message.quote.senderName}：${message.quote.summary}`}
        </Text>
      ) : null}
      <Text style={mine ? styles.mineText : styles.text}>{dmMessageText(message)}</Text>
      {message.status === 'failed' ? <Text style={styles.failed}>发送失败</Text> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bubble: {
    marginHorizontal: 16,
    marginVertical: 6,
    maxWidth: '78%',
    padding: 10,
    borderRadius: 12,
    gap: 6,
  },
  mine: { alignSelf: 'flex-end', backgroundColor: '#7B6CF9' },
  theirs: { alignSelf: 'flex-start', backgroundColor: '#FFFFFF' },
  hit: { borderWidth: 1, borderColor: '#F59E0B' },
  text: { color: APP_TEXT_COLOR, fontSize: 15 },
  mineText: { color: '#FFFFFF', fontSize: 15 },
  quote: { fontSize: 12, color: MUTED_TEXT_COLOR },
  failed: { color: '#FECACA', fontSize: 12 },
});
