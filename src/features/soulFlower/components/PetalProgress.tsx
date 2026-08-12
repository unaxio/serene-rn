import { StyleSheet, Text, View } from 'react-native';

import { PETAL_SLOT_COUNT } from '@/src/features/soulFlower/constants';
import { formatProgressLabel } from '@/src/features/soulFlower/utils/progress';

interface PetalProgressProps {
  completedCount: number;
  totalCount: number;
  accentColor?: string;
}

const DEFAULT_ACCENT = '#F472B6';
const EMPTY_PETAL = '#D1D5DB';

export function PetalProgress({
  completedCount,
  totalCount,
  accentColor = DEFAULT_ACCENT,
}: PetalProgressProps) {
  const filledCount = Math.min(completedCount, PETAL_SLOT_COUNT);
  const displayTotal = totalCount > 0 ? totalCount : PETAL_SLOT_COUNT;

  return (
    <View style={styles.row}>
      <View style={styles.petals}>
        {Array.from({ length: PETAL_SLOT_COUNT }).map((_, index) => {
          const isFilled = index < filledCount;
          return (
            <View
              key={`petal-${index}`}
              style={[
                styles.petal,
                {
                  backgroundColor: isFilled ? accentColor : 'transparent',
                  borderColor: isFilled ? accentColor : EMPTY_PETAL,
                },
              ]}
            />
          );
        })}
      </View>
      <Text style={styles.label}>
        {formatProgressLabel(completedCount, displayTotal)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  petals: {
    flexDirection: 'row',
    gap: 4,
    flex: 1,
  },
  petal: {
    width: 14,
    height: 18,
    borderRadius: 8,
    borderWidth: 1.5,
    transform: [{ rotate: '20deg' }],
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
    minWidth: 32,
    textAlign: 'right',
  },
});
