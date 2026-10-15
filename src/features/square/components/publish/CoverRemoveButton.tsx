import { Pressable, StyleSheet, Text } from 'react-native';

interface CoverRemoveButtonProps {
  onPress: () => void;
}

const REMOVE_BUTTON_SIZE = 22;
const REMOVE_BUTTON_INSET = 8;
const REMOVE_BUTTON_COLOR = '#EF4444';
const REMOVE_ICON_SIZE = 16;
const REMOVE_ICON_LINE_HEIGHT = 18;

export function CoverRemoveButton({ onPress }: CoverRemoveButtonProps) {
  return (
    <Pressable
      style={styles.button}
      hitSlop={REMOVE_BUTTON_INSET}
      onPress={onPress}
      accessibilityLabel="删除封面">
      <Text style={styles.icon}>×</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    top: REMOVE_BUTTON_INSET,
    right: REMOVE_BUTTON_INSET,
    width: REMOVE_BUTTON_SIZE,
    height: REMOVE_BUTTON_SIZE,
    borderRadius: REMOVE_BUTTON_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: REMOVE_BUTTON_COLOR,
  },
  icon: {
    color: '#FFFFFF',
    fontSize: REMOVE_ICON_SIZE,
    lineHeight: REMOVE_ICON_LINE_HEIGHT,
    fontWeight: '700',
  },
});
