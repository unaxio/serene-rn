import { SymbolView } from 'expo-symbols';
import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { APP_TEXT_COLOR } from '@/constants/Colors';
import {
  PROFILE_MUTED,
  REGION_CLEAR_LABEL,
  REGION_FIELD_PLACEHOLDER,
} from '@/src/features/profile/constants';
import { RegionPickerModal } from '@/src/features/profile/components/RegionPickerModal';
import type { RegionSelection } from '@/src/features/profile/regionTypes';

interface RegionPickerFieldProps {
  value: string;
  onChange: (selection: RegionSelection | null) => void;
}

const FIELD_MIN_HEIGHT = 44;
const ICON_SIZE = 16;

export function RegionPickerField({ value, onChange }: RegionPickerFieldProps) {
  const [visible, setVisible] = useState(false);
  const hasValue = value.trim().length > 0;

  const handleOpen = useCallback(() => {
    setVisible(true);
  }, []);

  const handleClose = useCallback(() => {
    setVisible(false);
  }, []);

  const handleSelect = useCallback(
    (selection: RegionSelection) => {
      onChange(selection);
      setVisible(false);
    },
    [onChange],
  );

  const handleClear = useCallback(() => {
    onChange(null);
  }, [onChange]);

  return (
    <>
      <View style={styles.field}>
        <Pressable style={styles.main} onPress={handleOpen}>
          <Text
            style={hasValue ? styles.value : styles.placeholder}
            numberOfLines={2}>
            {hasValue ? value : REGION_FIELD_PLACEHOLDER}
          </Text>
          {hasValue ? null : (
            <SymbolView
              name={{
                ios: 'chevron.right',
                android: 'arrow_forward_ios',
                web: 'arrow_forward_ios',
              }}
              size={ICON_SIZE}
              tintColor={PROFILE_MUTED}
            />
          )}
        </Pressable>
        {hasValue ? (
          <Pressable
            onPress={handleClear}
            hitSlop={8}
            accessibilityLabel={REGION_CLEAR_LABEL}
            style={styles.clear}>
            <SymbolView
              name={{ ios: 'xmark', android: 'close', web: 'close' }}
              size={ICON_SIZE}
              tintColor={PROFILE_MUTED}
            />
          </Pressable>
        ) : null}
      </View>
      <RegionPickerModal visible={visible} onClose={handleClose} onSelect={handleSelect} />
    </>
  );
}

const styles = StyleSheet.create({
  field: {
    minHeight: FIELD_MIN_HEIGHT,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
  },
  main: {
    flex: 1,
    minHeight: FIELD_MIN_HEIGHT,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  value: {
    flex: 1,
    fontSize: 15,
    color: APP_TEXT_COLOR,
  },
  placeholder: {
    flex: 1,
    fontSize: 15,
    color: PROFILE_MUTED,
  },
  clear: {
    paddingRight: 12,
    paddingVertical: 10,
  },
});
