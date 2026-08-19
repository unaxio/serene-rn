import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { AI_ACCENT_COLOR } from '@/src/features/soulFlower/constants';

const DOT_CYCLE_MS = 450;
const DOT_COUNT = 3;
const STAR_SIZE = 14;

function CrossStarIcon() {
  return (
    <Svg width={STAR_SIZE} height={STAR_SIZE} viewBox="0 0 14 14" fill="none">
      <Path
        d="M7 0.5L7.8 5.2L12.5 6L7.8 6.8L7 11.5L6.2 6.8L1.5 6L6.2 5.2L7 0.5Z"
        fill={AI_ACCENT_COLOR}
      />
      <Path
        d="M0.5 7L5.2 6.2L6 1.5L6.8 6.2L11.5 7L6.8 7.8L6 12.5L5.2 7.8L0.5 7Z"
        fill={AI_ACCENT_COLOR}
        opacity={0.85}
      />
    </Svg>
  );
}

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
        <CrossStarIcon />
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
