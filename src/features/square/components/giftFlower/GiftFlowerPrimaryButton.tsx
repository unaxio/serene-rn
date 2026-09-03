import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

import { ACCENT_COLOR } from '@/src/features/square/constants';

interface GiftFlowerPrimaryButtonProps {
  label: string;
  disabled?: boolean;
  loading?: boolean;
  onPress: () => void;
}

export function GiftFlowerPrimaryButton({
  label,
  disabled = false,
  loading = false,
  onPress,
}: GiftFlowerPrimaryButtonProps) {
  return (
    <Pressable
      style={[styles.button, (disabled || loading) && styles.disabled]}
      disabled={disabled || loading}
      onPress={onPress}>
      {loading ? (
        <ActivityIndicator color="#FFFFFF" />
      ) : (
        <Text style={styles.label}>{label}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 42,
    borderRadius: 10,
    backgroundColor: ACCENT_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.45,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
