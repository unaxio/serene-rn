import { SymbolView } from 'expo-symbols';
import { Alert, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { APP_TEXT_COLOR } from '@/constants/Colors';
import { COMING_SOON_MESSAGE } from '@/src/features/square/constants';
import { showToast } from '@/src/utils/toast';

interface StoryDetailHeaderProps {
  onBack: () => void;
}

const ICON_SIZE = 22;
const BACK_BUTTON_WIDTH = 30;
const HEADER_MIN_HEIGHT = 36;
const HEADER_HORIZONTAL_PADDING = 12;
const MIN_TOP_INSET = 12;

export function StoryDetailHeader({ onBack }: StoryDetailHeaderProps) {
  const insets = useSafeAreaInsets();

  const handleMore = () => {
    Alert.alert('更多', undefined, [
      {
        text: '举报',
        onPress: () => showToast(COMING_SOON_MESSAGE),
      },
      {
        text: '不感兴趣',
        onPress: () => showToast(COMING_SOON_MESSAGE),
      },
      { text: '取消', style: 'cancel' },
    ]);
  };

  return (
    <View style={[styles.wrap, { paddingTop: insets.top + MIN_TOP_INSET }]}>
      <View style={styles.header}>
        <Pressable onPress={onBack} hitSlop={12} style={styles.side}>
          <SymbolView
            name={{ ios: 'chevron.left', android: 'arrow_back_ios', web: 'arrow_back_ios' }}
            size={ICON_SIZE}
            tintColor={APP_TEXT_COLOR}
          />
        </Pressable>
        <Pressable onPress={handleMore} hitSlop={12} style={styles.side}>
          <SymbolView
            name={{ ios: 'ellipsis', android: 'more_horiz', web: 'more_horiz' }}
            size={ICON_SIZE}
            tintColor={APP_TEXT_COLOR}
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: 'transparent',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: HEADER_MIN_HEIGHT,
    paddingHorizontal: HEADER_HORIZONTAL_PADDING,
    paddingBottom: 8,
  },
  side: {
    width: BACK_BUTTON_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
});
