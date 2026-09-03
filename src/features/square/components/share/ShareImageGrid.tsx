import { Image } from 'expo-image';
import { useMemo } from 'react';
import { Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';

import {
  SEARCH_BAR_BG,
  SHARE_DEFAULT_GRID_COLUMNS,
  SHARE_FOUR_GRID_COLUMNS,
  SHARE_FOUR_IMAGE_COUNT,
  SHARE_IMAGE_GAP,
  SHARE_IMAGE_MAX_COUNT,
  SHARE_IMAGE_RADIUS,
  SHARE_ITEM_PADDING_H,
  SHARE_SIDEBAR_WIDTH,
  SHARE_SINGLE_IMAGE_MAX_HEIGHT,
} from '@/src/features/square/constants';
import { resolveCdnUrl } from '@/src/utils/cdn';

interface ShareImageGridProps {
  images: string[];
  onPress: (index: number) => void;
}

function getColumnCount(count: number): number {
  if (count === 1) {
    return 1;
  }
  if (count === SHARE_FOUR_IMAGE_COUNT) {
    return SHARE_FOUR_GRID_COLUMNS;
  }
  return SHARE_DEFAULT_GRID_COLUMNS;
}

export function ShareImageGrid({ images, onPress }: ShareImageGridProps) {
  const { width: windowWidth } = useWindowDimensions();
  const visible = images.slice(0, SHARE_IMAGE_MAX_COUNT);
  const columns = getColumnCount(visible.length);
  const contentWidth = windowWidth - SHARE_SIDEBAR_WIDTH - SHARE_ITEM_PADDING_H * 2;
  const tileSize = useMemo(() => {
    const gaps = SHARE_IMAGE_GAP * (columns - 1);
    return Math.floor((contentWidth - gaps) / columns);
  }, [columns, contentWidth]);

  if (visible.length === 0) {
    return null;
  }

  if (visible.length === 1) {
    const uri = resolveCdnUrl(visible[0]);
    if (!uri) {
      return null;
    }
    return (
      <Pressable onPress={() => onPress(0)}>
        <Image source={{ uri }} style={styles.single} contentFit="cover" />
      </Pressable>
    );
  }

  return (
    <View style={[styles.grid, { width: contentWidth }]}>
      {visible.map((path, index) => {
        const uri = resolveCdnUrl(path);
        if (!uri) {
          return null;
        }
        return (
          <Pressable key={`${path}-${index}`} onPress={() => onPress(index)}>
            <Image
              source={{ uri }}
              style={{
                width: tileSize,
                height: tileSize,
                borderRadius: SHARE_IMAGE_RADIUS,
              }}
              contentFit="cover"
            />
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SHARE_IMAGE_GAP,
  },
  single: {
    width: '100%',
    maxHeight: SHARE_SINGLE_IMAGE_MAX_HEIGHT,
    height: SHARE_SINGLE_IMAGE_MAX_HEIGHT,
    borderRadius: SHARE_IMAGE_RADIUS,
    backgroundColor: SEARCH_BAR_BG,
  },
});
