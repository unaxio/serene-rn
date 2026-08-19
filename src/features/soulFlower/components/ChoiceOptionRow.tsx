import { LinearGradient } from 'expo-linear-gradient';
import { memo, useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import {
  AI_ACCENT_COLOR,
  APP_TEXT_COLOR,
  AWARENESS_ACCENT_GRADIENT,
  AWARENESS_ACCENT_GRADIENT_LOCATIONS,
} from '@/src/features/soulFlower/constants';

interface ChoiceOptionRowProps {
  label: string;
  selected: boolean;
  disabled?: boolean;
  onPress: () => void;
}

const RADIO_SIZE = 18;
const RADIO_INNER_SIZE = 8;
const RADIO_IDLE_BORDER_WIDTH = 1.5;
const OPTION_DIVIDER_COLOR = 'rgba(31, 25, 92, 0.08)';

function ChoiceOptionRowComponent({
  label,
  selected,
  disabled = false,
  onPress,
}: ChoiceOptionRowProps) {
  const handlePress = useCallback(() => {
    onPress();
  }, [onPress]);

  return (
    <Pressable
      style={styles.row}
      onPress={handlePress}
      disabled={disabled}>
      <View style={styles.radioSlot}>
        {selected ? (
          <LinearGradient
            colors={[...AWARENESS_ACCENT_GRADIENT]}
            locations={[...AWARENESS_ACCENT_GRADIENT_LOCATIONS]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={styles.radioSelected}>
            <View style={styles.radioInner} />
          </LinearGradient>
        ) : (
          <View style={styles.radioIdle} />
        )}
      </View>
      <Text style={[styles.label, selected && styles.labelSelected]}>{label}</Text>
    </Pressable>
  );
}

export const ChoiceOptionRow = memo(ChoiceOptionRowComponent);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: OPTION_DIVIDER_COLOR,
    backgroundColor: 'transparent',
  },
  radioSlot: {
    width: RADIO_SIZE,
    height: RADIO_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioIdle: {
    width: RADIO_SIZE,
    height: RADIO_SIZE,
    borderRadius: RADIO_SIZE / 2,
    borderWidth: RADIO_IDLE_BORDER_WIDTH,
    borderColor: AI_ACCENT_COLOR,
    backgroundColor: 'transparent',
  },
  radioSelected: {
    width: RADIO_SIZE,
    height: RADIO_SIZE,
    borderRadius: RADIO_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: RADIO_INNER_SIZE,
    height: RADIO_INNER_SIZE,
    borderRadius: RADIO_INNER_SIZE / 2,
    backgroundColor: '#FFFFFF',
  },
  label: {
    flex: 1,
    fontSize: 15,
    color: APP_TEXT_COLOR,
    lineHeight: 22,
  },
  labelSelected: {
    color: AI_ACCENT_COLOR,
    fontWeight: '600',
  },
});
