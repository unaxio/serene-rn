import { Image } from 'expo-image';
import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import {
  DEFAULT_THEME_COLOR,
  DESIGN_PETAL_GAP,
  DESIGN_PETAL_HEIGHT,
  DESIGN_PETAL_WIDTH,
  PETAL_BLANK_IMAGE,
  PETAL_FILLED_IMAGES,
  PETAL_SLOT_COUNT,
} from '@/src/features/soulFlower/constants';
import type { ThemeColor } from '@/src/features/soulFlower/types';

interface PetalProgressBarProps {
  completedCount: number;
  themeColor: ThemeColor;
  flowerHex: string;
  scale: number;
}

const LINE_HEIGHT = 1.5;

export function PetalProgressBar({
  completedCount,
  themeColor,
  flowerHex,
  scale,
}: PetalProgressBarProps) {
  const petalWidth = DESIGN_PETAL_WIDTH * scale;
  const petalHeight = DESIGN_PETAL_HEIGHT * scale;
  const gap = DESIGN_PETAL_GAP * scale;
  const totalWidth =
    petalWidth * PETAL_SLOT_COUNT + gap * (PETAL_SLOT_COUNT - 1);
  const filledSource =
    PETAL_FILLED_IMAGES[themeColor] ?? PETAL_FILLED_IMAGES[DEFAULT_THEME_COLOR];
  const slots = useMemo(
    () => Array.from({ length: PETAL_SLOT_COUNT }, (_, index) => index),
    [],
  );

  return (
    <View style={[styles.wrap, { width: totalWidth, height: petalHeight }]}>
      <View
        style={[
          styles.line,
          {
            backgroundColor: flowerHex,
            left: petalWidth / 2,
            right: petalWidth / 2,
            top: (petalHeight - LINE_HEIGHT) / 2,
          },
        ]}
      />
      <View style={[styles.petals, { gap }]}>
        {slots.map((index) => (
          <Image
            key={`petal-${index}`}
            source={index < completedCount ? filledSource : PETAL_BLANK_IMAGE}
            style={{ width: petalWidth, height: petalHeight }}
            contentFit="contain"
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    justifyContent: 'center',
  },
  line: {
    position: 'absolute',
    height: LINE_HEIGHT,
    zIndex: 0,
  },
  petals: {
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1,
  },
});
