import { Image } from 'expo-image';
import { SymbolView } from 'expo-symbols';
import { StyleSheet, Text, View } from 'react-native';

import { APP_TEXT_COLOR } from '@/constants/Colors';
import { ANONYMOUS_DISPLAY_NAME } from '@/src/features/square/constants';
import type { SquareAuthor } from '@/src/features/square/types';
import {
  getAuthorAvatarPath,
  getAuthorDisplayName,
} from '@/src/features/square/utils/displayAuthor';
import { resolveCdnUrl } from '@/src/utils/cdn';

interface SquareUserAvatarProps {
  author: SquareAuthor | null | undefined;
  size?: number;
}

const DEFAULT_AVATAR_SIZE = 36;
const FALLBACK_ICON_RATIO = 0.5;
const FALLBACK_TEXT_RATIO = 0.4;

export function SquareUserAvatar({
  author,
  size = DEFAULT_AVATAR_SIZE,
}: SquareUserAvatarProps) {
  const uri = resolveCdnUrl(getAuthorAvatarPath(author));
  const displayName = getAuthorDisplayName(author);
  const radius = size / 2;

  if (uri) {
    return (
      <Image
        source={{ uri }}
        style={{ width: size, height: size, borderRadius: radius }}
        contentFit="cover"
      />
    );
  }

  return (
    <View
      style={[
        styles.placeholder,
        { width: size, height: size, borderRadius: radius },
      ]}>
      {displayName === ANONYMOUS_DISPLAY_NAME ? (
        <SymbolView
          name={{ ios: 'person.fill', android: 'person', web: 'person' }}
          size={Math.round(size * FALLBACK_ICON_RATIO)}
          tintColor={APP_TEXT_COLOR}
        />
      ) : (
        <Text style={[styles.fallback, { fontSize: Math.round(size * FALLBACK_TEXT_RATIO) }]}>
          {displayName.slice(0, 1)}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  placeholder: {
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fallback: {
    fontWeight: '600',
    color: APP_TEXT_COLOR,
  },
});
