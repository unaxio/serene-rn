import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { ACCENT_COLOR, MUTED_TEXT_COLOR } from '@/src/features/square/constants';

interface GiftFlowerPaneStatusProps {
  isLoading: boolean;
  isError: boolean;
  isEmpty: boolean;
  emptyText: string;
  errorText: string;
  onRetry: () => void;
}

export function GiftFlowerPaneStatus({
  isLoading,
  isError,
  isEmpty,
  emptyText,
  errorText,
  onRetry,
}: GiftFlowerPaneStatusProps) {
  if (isLoading) {
    return <ActivityIndicator style={styles.status} color={ACCENT_COLOR} />;
  }
  if (isError) {
    return (
      <View style={styles.status}>
        <Text style={styles.muted}>{errorText}</Text>
        <Pressable onPress={onRetry}>
          <Text style={styles.retry}>重试</Text>
        </Pressable>
      </View>
    );
  }
  if (isEmpty) {
    return <Text style={styles.muted}>{emptyText}</Text>;
  }
  return null;
}

const styles = StyleSheet.create({
  status: {
    alignItems: 'center',
    paddingVertical: 24,
    gap: 8,
  },
  muted: {
    textAlign: 'center',
    color: MUTED_TEXT_COLOR,
    fontSize: 14,
    paddingVertical: 24,
  },
  retry: {
    fontSize: 14,
    fontWeight: '600',
    color: ACCENT_COLOR,
  },
});
