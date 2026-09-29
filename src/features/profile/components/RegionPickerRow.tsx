import { SymbolView } from 'expo-symbols';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

import { APP_TEXT_COLOR } from '@/constants/Colors';
import { PROFILE_ACCENT, PROFILE_MUTED } from '@/src/features/profile/constants';
import type { RegionOption } from '@/src/features/profile/regionTypes';

interface RegionPickerRowProps {
  item: RegionOption;
  pending: boolean;
  onPress: (item: RegionOption) => void;
}

const ROW_MIN_HEIGHT = 48;
const CHEVRON_SIZE = 16;
const ROW_HORIZONTAL_PADDING = 16;

export function RegionPickerRow({ item, pending, onPress }: RegionPickerRowProps) {
  return (
    <Pressable
      style={styles.row}
      disabled={pending}
      onPress={() => onPress(item)}>
      <Text style={styles.name} numberOfLines={1}>
        {item.name}
      </Text>
      {pending ? (
        <ActivityIndicator color={PROFILE_ACCENT} />
      ) : item.leaf ? null : (
        <SymbolView
          name={{
            ios: 'chevron.right',
            android: 'arrow_forward_ios',
            web: 'arrow_forward_ios',
          }}
          size={CHEVRON_SIZE}
          tintColor={PROFILE_MUTED}
        />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: ROW_MIN_HEIGHT,
    paddingHorizontal: ROW_HORIZONTAL_PADDING,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E2E8F0',
    gap: 12,
  },
  name: {
    flex: 1,
    fontSize: 16,
    color: APP_TEXT_COLOR,
  },
});
