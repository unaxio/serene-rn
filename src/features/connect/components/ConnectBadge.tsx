import { StyleSheet, Text, View } from 'react-native';

import { formatUnreadBadge } from '@/src/features/connect/utils/formatUnreadBadge';

interface ConnectBadgeProps {
  count: number;
}

const BADGE_COLOR = '#EF4444';

export function ConnectBadge({ count }: ConnectBadgeProps) {
  const label = formatUnreadBadge(count);
  if (!label) {
    return null;
  }
  return (
    <View style={styles.badge}>
      <Text style={styles.text}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    minWidth: 18,
    height: 18,
    paddingHorizontal: 5,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BADGE_COLOR,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
});
