import { SymbolView } from 'expo-symbols';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { COMMENT_HIGHLIGHT_COLOR, MUTED_TEXT_COLOR } from '@/src/features/square/constants';

interface CommentActionButtonProps {
  icon: ComponentProps<typeof SymbolView>['name'];
  label: string;
  active?: boolean;
  onPress: () => void;
}

const ICON_SIZE = 14;

export function CommentActionButton({
  icon,
  label,
  active = false,
  onPress,
}: CommentActionButtonProps) {
  const color = active ? COMMENT_HIGHLIGHT_COLOR : MUTED_TEXT_COLOR;
  return (
    <Pressable style={styles.button} onPress={onPress} hitSlop={8}>
      <SymbolView name={icon} size={ICON_SIZE} tintColor={color} />
      <Text style={[styles.label, { color }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  label: {
    fontSize: 12,
  },
});
