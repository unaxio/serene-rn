import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ACCENT_COLOR, MUTED_TEXT_COLOR } from '@/src/features/square/constants';

interface ShareListStatusProps {
  message: string;
  onRetry?: () => void;
}

export function ShareListStatus({ message, onRetry }: ShareListStatusProps) {
  return (
    <View style={styles.status}>
      <Text style={styles.statusText}>{message}</Text>
      {onRetry ? (
        <Pressable onPress={onRetry}>
          <Text style={styles.retry}>重试</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  status: {
    paddingVertical: 48,
    alignItems: 'center',
    gap: 8,
  },
  statusText: {
    fontSize: 14,
    color: MUTED_TEXT_COLOR,
  },
  retry: {
    fontSize: 14,
    fontWeight: '600',
    color: ACCENT_COLOR,
  },
});
