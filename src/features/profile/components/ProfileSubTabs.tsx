import { Pressable, StyleSheet, Text, View } from 'react-native';

import { APP_TEXT_COLOR } from '@/constants/Colors';
import { PROFILE_ACCENT, PROFILE_MUTED, PROFILE_SURFACE } from '@/src/features/profile/constants';

interface ProfileSubTabsProps<T extends string> {
  options: readonly { id: T; label: string }[];
  value: T;
  onChange: (id: T) => void;
}

export function ProfileSubTabs<T extends string>({
  options,
  value,
  onChange,
}: ProfileSubTabsProps<T>) {
  return (
    <View style={styles.wrap}>
      {options.map((option) => {
        const active = option.id === value;
        return (
          <Pressable
            key={option.id}
            style={[styles.chip, active && styles.chipActive]}
            onPress={() => onChange(option.id)}>
            <Text style={[styles.label, active && styles.labelActive]}>{option.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: PROFILE_SURFACE,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
  },
  chipActive: {
    backgroundColor: PROFILE_ACCENT,
  },
  label: {
    fontSize: 13,
    color: PROFILE_MUTED,
  },
  labelActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
