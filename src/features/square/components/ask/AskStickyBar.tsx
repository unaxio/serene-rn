import { Pressable, StyleSheet, Text, View } from 'react-native';

import { APP_TEXT_COLOR } from '@/constants/Colors';
import { ACCENT_COLOR, ASK_GO_ANSWER_LABEL, CARD_BORDER_COLOR } from '@/src/features/square/constants';

interface AskStickyBarProps {
  title: string;
  onAnswer: () => void;
}

const BAR_HEIGHT = 48;
const BUTTON_HEIGHT = 32;

export function AskStickyBar({ title, onAnswer }: AskStickyBarProps) {
  return (
    <View style={styles.bar}>
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
      <Pressable style={styles.button} onPress={onAnswer}>
        <Text style={styles.buttonText}>{ASK_GO_ANSWER_LABEL}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    minHeight: BAR_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: CARD_BORDER_COLOR,
  },
  title: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: APP_TEXT_COLOR,
  },
  button: {
    height: BUTTON_HEIGHT,
    paddingHorizontal: 14,
    borderRadius: BUTTON_HEIGHT / 2,
    backgroundColor: ACCENT_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
