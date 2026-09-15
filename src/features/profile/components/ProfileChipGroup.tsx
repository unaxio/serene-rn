import { Pressable, StyleSheet, Text, View } from 'react-native';

import { PROFILE_ACCENT, PROFILE_MUTED } from '@/src/features/profile/constants';

interface ProfileChipOption<T extends string> {
  id: T;
  label: string;
}

interface ProfileChipGroupProps<T extends string> {
  options: readonly ProfileChipOption<T>[];
  value: T;
  onChange: (id: T) => void;
}

export function ProfileChipGroup<T extends string>({
  options,
  value,
  onChange,
}: ProfileChipGroupProps<T>) {
  return (
    <View style={styles.chips}>
      {options.map((option) => {
        const active = option.id === value;
        return (
          <Pressable
            key={option.id || 'empty'}
            style={[styles.chip, active && styles.chipActive]}
            onPress={() => onChange(option.id)}>
            <Text style={[styles.chipText, active && styles.chipTextActive]}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
  },
  chipActive: { backgroundColor: PROFILE_ACCENT },
  chipText: { fontSize: 13, color: PROFILE_MUTED },
  chipTextActive: { color: '#FFFFFF', fontWeight: '600' },
});
