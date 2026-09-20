import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { APP_TEXT_COLOR } from '@/constants/Colors';
import { PROFILE_SURFACE } from '@/src/features/profile/constants';

interface ProfileHomeHeaderProps {
  onPressSettings: () => void;
}

const ICON_SIZE = 22;
const MIN_TOP_INSET = 12;

export function ProfileHomeHeader({ onPressSettings }: ProfileHomeHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrap, { paddingTop: insets.top + MIN_TOP_INSET }]}>
      <Text style={styles.title}>我的</Text>
      <View style={styles.actions}>
        <Pressable onPress={onPressSettings} hitSlop={10} style={styles.iconBtn}>
          <SymbolView
            name={{ ios: 'gearshape', android: 'settings', web: 'settings' }}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 8,
    backgroundColor: PROFILE_SURFACE,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: APP_TEXT_COLOR,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  iconBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
