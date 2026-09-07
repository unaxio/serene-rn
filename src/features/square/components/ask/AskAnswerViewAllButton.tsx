import { Pressable, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  ACCENT_COLOR,
  ASK_VIEW_ALL_ANSWERS_LABEL,
  COMMENT_HORIZONTAL_PADDING,
} from '@/src/features/square/constants';

interface AskAnswerViewAllButtonProps {
  onPress: () => void;
}

const CTA_HEIGHT = 40;
const CTA_BORDER_WIDTH = 1;
const CTA_VERTICAL_MARGIN = 16;

export function AskAnswerViewAllButton({ onPress }: AskAnswerViewAllButtonProps) {
  const insets = useSafeAreaInsets();

  return (
    <Pressable
      style={[
        styles.button,
        { marginBottom: Math.max(insets.bottom, CTA_VERTICAL_MARGIN) },
      ]}
      onPress={onPress}>
      <Text style={styles.label}>{ASK_VIEW_ALL_ANSWERS_LABEL}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: CTA_HEIGHT,
    marginHorizontal: COMMENT_HORIZONTAL_PADDING,
    marginTop: CTA_VERTICAL_MARGIN,
    borderRadius: CTA_HEIGHT / 2,
    borderWidth: CTA_BORDER_WIDTH,
    borderColor: ACCENT_COLOR,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    color: ACCENT_COLOR,
    fontSize: 15,
    fontWeight: '700',
  },
});
