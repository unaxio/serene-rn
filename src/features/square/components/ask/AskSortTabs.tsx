import { Pressable, StyleSheet, Text, View } from 'react-native';

import { APP_TEXT_COLOR } from '@/constants/Colors';
import {
  ACCENT_COLOR,
  ASK_SORT_OPTIONS,
  CARD_BORDER_COLOR,
  MUTED_TEXT_COLOR,
} from '@/src/features/square/constants';
import type { AskAnswerSort } from '@/src/features/square/types';

interface AskSortTabsProps {
  value: AskAnswerSort;
  onChange: (value: AskAnswerSort) => void;
}

export function AskSortTabs({ value, onChange }: AskSortTabsProps) {
  return (
    <View style={styles.row}>
      {ASK_SORT_OPTIONS.map((option) => {
        const isActive = option.id === value;
        return (
          <Pressable key={option.id} onPress={() => onChange(option.id)} style={styles.tab}>
            <Text style={[styles.label, isActive && styles.labelActive]}>{option.label}</Text>
            {isActive ? <View style={styles.underline} /> : <View style={styles.spacer} />}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 20,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: CARD_BORDER_COLOR,
    backgroundColor: '#FFFFFF',
  },
  tab: {
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: MUTED_TEXT_COLOR,
  },
  labelActive: {
    fontWeight: '700',
    color: APP_TEXT_COLOR,
  },
  underline: {
    marginTop: 6,
    height: 2,
    alignSelf: 'stretch',
    backgroundColor: ACCENT_COLOR,
  },
  spacer: {
    marginTop: 6,
    height: 2,
  },
});
