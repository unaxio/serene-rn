import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

import { APP_TEXT_COLOR } from '@/constants/Colors';
import { resolveCdnUrl } from '@/src/utils/cdn';

interface ConnectAvatarProps {
  uri: string | null;
  name: string;
  size: number;
}

const FALLBACK_BG = '#EDE9FE';

export function ConnectAvatar({ uri, name, size }: ConnectAvatarProps) {
  const resolved = resolveCdnUrl(uri);
  const radius = size / 2;
  if (resolved) {
    return (
      <Image
        source={{ uri: resolved }}
        style={{ width: size, height: size, borderRadius: radius }}
        contentFit="cover"
      />
    );
  }
  return (
    <View style={[styles.fallback, { width: size, height: size, borderRadius: radius }]}>
      <Text style={styles.letter}>{name.slice(0, 1) || '系'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  fallback: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: FALLBACK_BG,
  },
  letter: {
    fontSize: 16,
    fontWeight: '700',
    color: APP_TEXT_COLOR,
  },
});
