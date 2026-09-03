import { SymbolView } from 'expo-symbols';
import { StyleSheet, Text, View } from 'react-native';

import {
  PLACEHOLDER_TEXT_COLOR,
  SEARCH_BAR_BG,
} from '@/src/features/square/constants';

const SEARCH_ICON_SIZE = 16;
const SEARCH_PLACEHOLDER = '搜索分享、问答、故事、用户、话题';

export function SquareSearchBar() {
  return (
    <View style={styles.bar}>
      <SymbolView
        name={{ ios: 'magnifyingglass', android: 'search', web: 'search' }}
        size={SEARCH_ICON_SIZE}
        tintColor={PLACEHOLDER_TEXT_COLOR}
      />
      <Text style={styles.placeholder}>{SEARCH_PLACEHOLDER}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    marginHorizontal: 16,
    marginBottom: 8,
    height: 40,
    borderRadius: 20,
    backgroundColor: SEARCH_BAR_BG,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: 8,
  },
  placeholder: {
    flex: 1,
    fontSize: 13,
    color: PLACEHOLDER_TEXT_COLOR,
  },
});
