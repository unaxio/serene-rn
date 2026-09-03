import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

interface GiftFlowerGridProps {
  children: ReactNode;
}

export function GiftFlowerGrid({ children }: GiftFlowerGridProps) {
  return <View style={styles.grid}>{children}</View>;
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
