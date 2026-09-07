import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { APP_TEXT_COLOR } from '@/constants/Colors';
import {
  ACCENT_COLOR,
  GIFT_FLOWER_THUMB_SIZE,
  MUTED_TEXT_COLOR,
} from '@/src/features/square/constants';
import { resolveCdnUrl } from '@/src/utils/cdn';

interface GiftFlowerTileProps {
  name: string;
  imagePath: string;
  badge?: string;
  actionLabel?: string;
  selected: boolean;
  disabled?: boolean;
  onPress: () => void;
}

export function GiftFlowerTile({
  name,
  imagePath,
  badge,
  actionLabel,
  selected,
  disabled = false,
  onPress,
}: GiftFlowerTileProps) {
  const uri = resolveCdnUrl(imagePath);

  return (
    <Pressable
      style={[styles.tile, selected && styles.selected, disabled && styles.disabled]}
      disabled={disabled}
      onPress={onPress}>
      <View style={styles.thumb}>
        {uri ? (
          <Image source={{ uri }} style={styles.image} contentFit="contain" />
        ) : (
          <Text style={styles.placeholder}>花</Text>
        )}
      </View>
      <Text style={styles.name} numberOfLines={1}>
        {name}
      </Text>
      {badge ? (
        <Text style={styles.badge} numberOfLines={1}>
          {badge}
        </Text>
      ) : null}
      {actionLabel ? (
        <View style={styles.action}>
          <Text style={styles.actionText}>{actionLabel}</Text>
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: {
    width: '33.33%',
    paddingHorizontal: 6,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  selected: {
    borderColor: ACCENT_COLOR,
    backgroundColor: '#F5F3FF',
  },
  disabled: {
    opacity: 0.4,
  },
  thumb: {
    width: GIFT_FLOWER_THUMB_SIZE,
    height: GIFT_FLOWER_THUMB_SIZE,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    fontSize: 18,
    color: MUTED_TEXT_COLOR,
  },
  name: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: '600',
    color: APP_TEXT_COLOR,
    textAlign: 'center',
  },
  badge: {
    marginTop: 2,
    fontSize: 11,
    color: MUTED_TEXT_COLOR,
    textAlign: 'center',
  },
  action: {
    marginTop: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: ACCENT_COLOR,
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
});
