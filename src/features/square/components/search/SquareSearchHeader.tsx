import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { APP_TEXT_COLOR } from '@/constants/Colors';
import { PAGE_SURFACE_COLOR, PLACEHOLDER_TEXT_COLOR, SEARCH_BAR_BG, SEARCH_PLACEHOLDER } from '@/src/features/square/constants';

interface SquareSearchHeaderProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onBack: () => void;
}

const ICON_SIZE = 22;
const BACK_BUTTON_WIDTH = 30;
const HEADER_MIN_HEIGHT = 36;
const HEADER_HORIZONTAL_PADDING = 12;
const MIN_TOP_INSET = 12;
const SEARCH_BAR_HEIGHT = 36;
const SEARCH_ICON_SIZE = 16;

export function SquareSearchHeader({
  value,
  onChange,
  onSubmit,
  onBack,
}: SquareSearchHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrap, { paddingTop: insets.top + MIN_TOP_INSET }]}>
      <View style={styles.header}>
        <Pressable onPress={onBack} hitSlop={12} style={styles.back}>
          <SymbolView
            name={{
              ios: 'chevron.left',
              android: 'arrow_back_ios',
              web: 'arrow_back_ios',
            }}
            size={ICON_SIZE}
            tintColor={APP_TEXT_COLOR}
          />
        </Pressable>
        <View style={styles.inputWrap}>
          <SymbolView
            name={{ ios: 'magnifyingglass', android: 'search', web: 'search' }}
            size={SEARCH_ICON_SIZE}
            tintColor={PLACEHOLDER_TEXT_COLOR}
          />
          <TextInput
            style={styles.input}
            value={value}
            onChangeText={onChange}
            placeholder={SEARCH_PLACEHOLDER}
            placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
            returnKeyType="search"
            autoFocus
            autoCapitalize="none"
            autoCorrect={false}
            onSubmitEditing={onSubmit}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: PAGE_SURFACE_COLOR,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: HEADER_MIN_HEIGHT,
    paddingHorizontal: HEADER_HORIZONTAL_PADDING,
    paddingBottom: 8,
    gap: 8,
  },
  back: {
    width: BACK_BUTTON_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  inputWrap: {
    flex: 1,
    height: SEARCH_BAR_HEIGHT,
    borderRadius: SEARCH_BAR_HEIGHT / 2,
    backgroundColor: SEARCH_BAR_BG,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 6,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: APP_TEXT_COLOR,
    paddingVertical: 0,
  },
});
