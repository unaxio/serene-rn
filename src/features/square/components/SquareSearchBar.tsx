import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import {
  PLACEHOLDER_TEXT_COLOR,
  SEARCH_BAR_BG,
  SEARCH_PLACEHOLDER,
} from '@/src/features/square/constants';

const SEARCH_ICON_SIZE = 16;
const SEARCH_BAR_HEIGHT = 40;

export function SquareSearchBar() {
  const router = useRouter();

  return (
    <Pressable
      style={styles.bar}
      onPress={() => {
        router.push('/square/search');
      }}>
      <SymbolView
        name={{ ios: 'magnifyingglass', android: 'search', web: 'search' }}
        size={SEARCH_ICON_SIZE}
        tintColor={PLACEHOLDER_TEXT_COLOR}
      />
      <Text style={styles.placeholder}>{SEARCH_PLACEHOLDER}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bar: {
    marginHorizontal: 16,
    marginBottom: 8,
    height: SEARCH_BAR_HEIGHT,
    borderRadius: SEARCH_BAR_HEIGHT / 2,
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
