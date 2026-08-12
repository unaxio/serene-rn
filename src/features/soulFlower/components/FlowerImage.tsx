import { Image } from 'expo-image';
import { SymbolView } from 'expo-symbols';
import { StyleSheet, Text, View } from 'react-native';

import { APP_TEXT_COLOR } from '@/src/features/soulFlower/constants';
import { resolveCdnUrl } from '@/src/utils/cdn';

interface FlowerImageProps {
  flowerImageUrl?: string | null;
  size?: number;
  /** 进度为 0 时模糊并显示锁标 */
  locked?: boolean;
}

const IMAGE_BLUR_RADIUS = 12;
const LOCK_BADGE_RATIO = 0.36;

export function FlowerImage({
  flowerImageUrl,
  size = 140,
  locked = false,
}: FlowerImageProps) {
  const uri = resolveCdnUrl(flowerImageUrl);
  const lockBadgeSize = Math.max(28, Math.round(size * LOCK_BADGE_RATIO));
  const lockIconSize = Math.round(lockBadgeSize * 0.5);

  return (
    <View style={[styles.frame, { width: size, height: size }]}>
      {uri ? (
        <Image
          source={{ uri }}
          style={styles.image}
          contentFit="contain"
          transition={200}
          blurRadius={locked ? IMAGE_BLUR_RADIUS : 0}
        />
      ) : (
        <View style={[styles.placeholder, locked && styles.placeholderLocked]}>
          <Text style={styles.placeholderText}>暂无花图</Text>
        </View>
      )}

      {locked ? (
        <View style={styles.lockOverlay} pointerEvents="none">
          <View
            style={[
              styles.lockBadge,
              { width: lockBadgeSize, height: lockBadgeSize, borderRadius: lockBadgeSize / 2 },
            ]}>
            <SymbolView
              name={{
                ios: 'lock.fill',
                android: 'lock',
                web: 'lock',
              }}
              size={lockIconSize}
              tintColor={APP_TEXT_COLOR}
            />
          </View>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    alignSelf: 'center',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#F1F5F9',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderLocked: {
    opacity: 0.55,
  },
  placeholderText: {
    fontSize: 13,
    color: '#94A3B8',
  },
  lockOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  lockBadge: {
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1F195C',
    shadowOpacity: 0.12,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
});
