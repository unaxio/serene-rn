import { ScrollView, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import type { ReactNode } from 'react';

import { GIFT_FLOWER_GRID_MAX_HEIGHT } from '@/src/features/square/constants';

interface GiftFlowerItemScrollerProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function GiftFlowerItemScroller({ children, style }: GiftFlowerItemScrollerProps) {
  return (
    <ScrollView
      style={[styles.scrollView, style]}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      bounces={false}
      alwaysBounceVertical={false}
      overScrollMode="never"
      showsVerticalScrollIndicator={false}>
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 0,
    flexShrink: 1,
    maxHeight: GIFT_FLOWER_GRID_MAX_HEIGHT,
  },
  content: {
    flexGrow: 0,
    paddingBottom: 8,
  },
});
