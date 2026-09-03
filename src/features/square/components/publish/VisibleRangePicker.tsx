import { Pressable, StyleSheet, Text, View } from 'react-native';

import { APP_TEXT_COLOR } from '@/constants/Colors';
import {
  ACCENT_COLOR,
  MUTED_TEXT_COLOR,
  SEARCH_BAR_BG,
  SHARE_VISIBLE_RANGE_LABEL,
  SHARE_VISIBLE_RANGE_OPTIONS,
} from '@/src/features/square/constants';
import type { ShareVisibleRange } from '@/src/features/square/types';

interface VisibleRangePickerProps {
  value: ShareVisibleRange;
  onChange: (value: ShareVisibleRange) => void;
}

export function VisibleRangePicker({ value, onChange }: VisibleRangePickerProps) {
  return (
    <View style={styles.block}>
      <Text style={styles.label}>{SHARE_VISIBLE_RANGE_LABEL}</Text>
      <View style={styles.row}>
        {SHARE_VISIBLE_RANGE_OPTIONS.map((option) => {
          const isActive = option.id === value;
          return (
            <Pressable
              key={option.id}
              style={[styles.chip, isActive && styles.chipActive]}
              onPress={() => onChange(option.id)}>
              <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    gap: 10,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: APP_TEXT_COLOR,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: SEARCH_BAR_BG,
  },
  chipActive: {
    backgroundColor: ACCENT_COLOR,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '500',
    color: MUTED_TEXT_COLOR,
  },
  chipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
