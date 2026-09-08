import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

import { APP_TEXT_COLOR } from '@/constants/Colors';

interface ContentMoreButtonProps {
  onPress: () => void;
  size?: number;
  hitSlop?: number;
  style?: StyleProp<ViewStyle>;
}

const DEFAULT_ICON_SIZE = 22;
const DEFAULT_HIT_SLOP = 12;
const BUTTON_WIDTH = 30;

export function ContentMoreButton({
  onPress,
  size = DEFAULT_ICON_SIZE,
  hitSlop = DEFAULT_HIT_SLOP,
  style,
}: ContentMoreButtonProps) {
  return (
    <Pressable onPress={onPress} hitSlop={hitSlop} style={[styles.button, style]}>
      <SymbolView
        name={{ ios: 'ellipsis', android: 'more_horiz', web: 'more_horiz' }}
        size={size}
        tintColor={APP_TEXT_COLOR}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: BUTTON_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
});
