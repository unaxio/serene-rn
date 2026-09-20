import type { ReactNode } from 'react';
import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { APP_TEXT_COLOR } from '@/constants/Colors';

interface SquarePageHeaderProps {
  title: string;
  onBack: () => void;
  right?: ReactNode;
}

const BACK_ICON_SIZE = 22;
const BACK_BUTTON_WIDTH = 30;
const HEADER_MIN_HEIGHT = 36;
const HEADER_TITLE_SIZE = 18;
/** 与 StoryDetailHeader / FullScreenModal 一致：安全区之外再留一段顶距 */
const MIN_TOP_INSET = 12;
const HEADER_BOTTOM_PADDING = 8;

export function SquarePageHeader({ title, onBack, right }: SquarePageHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.header, { paddingTop: insets.top + MIN_TOP_INSET }]}>
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
      <View style={styles.side}>{right}</View>
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
    paddingBottom: HEADER_BOTTOM_PADDING,
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
