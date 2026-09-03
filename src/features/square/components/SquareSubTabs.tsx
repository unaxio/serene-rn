import { memo, useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { APP_TEXT_COLOR } from '@/constants/Colors';
import { ACCENT_COLOR, SQUARE_SUB_TABS } from '@/src/features/square/constants';
import type { SquareSubTabId } from '@/src/features/square/types';

interface SquareSubTabsProps {
  activeTab: SquareSubTabId;
  onChange: (tab: SquareSubTabId) => void;
}

function SquareSubTabsComponent({ activeTab, onChange }: SquareSubTabsProps) {
  const handlePress = useCallback(
    (tab: SquareSubTabId) => {
      onChange(tab);
    },
    [onChange],
  );

  return (
    <View style={styles.row}>
      {SQUARE_SUB_TABS.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <Pressable
            key={tab.id}
            style={styles.item}
            onPress={() => handlePress(tab.id)}>
            <Text style={[styles.label, isActive && styles.labelActive]}>
              {tab.label}
            </Text>
            {isActive ? <View style={styles.indicator} /> : <View style={styles.indicatorPlaceholder} />}
          </Pressable>
        );
      })}
    </View>
  );
}

export const SquareSubTabs = memo(SquareSubTabsComponent);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E8E6F2',
  },
  item: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 10,
  },
  label: {
    fontSize: 15,
    fontWeight: '500',
    color: APP_TEXT_COLOR,
    opacity: 0.55,
  },
  labelActive: {
    fontWeight: '700',
    opacity: 1,
  },
  indicator: {
    marginTop: 8,
    height: 3,
    width: 24,
    borderRadius: 2,
    backgroundColor: ACCENT_COLOR,
  },
  indicatorPlaceholder: {
    marginTop: 8,
    height: 3,
  },
});
