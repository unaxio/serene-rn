import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { APP_TEXT_COLOR } from '@/constants/Colors';

interface SquarePageHeaderProps {
  title: string;
  onBack: () => void;
}

const BACK_ICON_SIZE = 22;
const BACK_BUTTON_WIDTH = 30;
const HEADER_MIN_HEIGHT = 36;
const HEADER_TITLE_SIZE = 18;

export function SquarePageHeader({ title, onBack }: SquarePageHeaderProps) {
  return (
    <View style={styles.header}>
      <Pressable onPress={onBack} hitSlop={12} style={styles.side}>
        <SymbolView
          name={{ ios: 'chevron.left', android: 'arrow_back_ios', web: 'arrow_back_ios' }}
          size={BACK_ICON_SIZE}
          tintColor={APP_TEXT_COLOR}
        />
      </Pressable>
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
      <View style={styles.side} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: HEADER_MIN_HEIGHT,
    paddingHorizontal: 12,
    paddingBottom: 8,
  },
  side: {
    width: BACK_BUTTON_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: HEADER_TITLE_SIZE,
    fontWeight: '700',
    color: APP_TEXT_COLOR,
  },
});
