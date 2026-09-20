import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { APP_TEXT_COLOR } from '@/constants/Colors';
import type { DmMessage } from '@/src/features/connect/types';
import { MUTED_TEXT_COLOR } from '@/src/features/square/constants';
import { resolveCdnUrl } from '@/src/utils/cdn';

interface DmBubbleProps {
  message: DmMessage;
  mine: boolean;
  highlighted: boolean;
  onLongPress: (message: DmMessage) => void;
}

const IMAGE_SIZE = 120;

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
      {message.kind === 'image'
        ? message.imagePaths.map((path) => {
            const uri = resolveCdnUrl(path);
            return uri ? (
              <Image key={path} source={{ uri }} style={styles.image} contentFit="cover" />
            ) : null;
          })
        : <Text style={mine ? styles.mineText : styles.text}>{message.content}</Text>}
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
  image: { width: IMAGE_SIZE, height: IMAGE_SIZE, borderRadius: 8 },
  failed: { color: '#FECACA', fontSize: 12 },
});
