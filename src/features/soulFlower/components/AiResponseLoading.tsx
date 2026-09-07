import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { CrossStarIcon } from '@/src/components/CrossStarIcon';
import { AI_ACCENT_COLOR } from '@/src/features/soulFlower/constants';

const DOT_CYCLE_MS = 450;
const DOT_COUNT = 3;
const STAR_SIZE = 14;

export function AiResponseLoading() {
  const [visibleDotCount, setVisibleDotCount] = useState(1);

  useEffect(() => {
    const timer = setInterval(() => {
      setVisibleDotCount((prev) => (prev % DOT_COUNT) + 1);
    }, DOT_CYCLE_MS);

    return () => clearInterval(timer);
  }, []);

  const dots = Array.from({ length: visibleDotCount }, (_, index) => index);

  return (
    <View style={styles.row} accessibilityRole="progressbar">
      <View style={styles.starSlot}>
        <CrossStarIcon size={STAR_SIZE} color={AI_ACCENT_COLOR} />
      </View>
      <View style={styles.dotsSlot}>
        {dots.map((index) => (
          <View key={`dot-${index}`} style={styles.dot} />
        ))}
      </View>
    </View>
  );
}

const DOT_SIZE = 3;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
    height: STAR_SIZE,
  },
  starSlot: {
    width: STAR_SIZE,
    height: STAR_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotsSlot: {
    height: STAR_SIZE,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    backgroundColor: AI_ACCENT_COLOR,
  },
});
