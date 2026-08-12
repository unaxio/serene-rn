import { LinearGradient } from 'expo-linear-gradient';
import { memo, useCallback } from 'react';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';

import {
  ALL_CATEGORY_ID,
  APP_TEXT_COLOR,
  CATEGORY_TAB_GRADIENT,
  CATEGORY_TAB_INACTIVE_BG,
} from '@/src/features/soulFlower/constants';
import type { Category } from '@/src/features/soulFlower/types';

interface MindMapFilterTabsProps {
  categories: Category[];
  selectedCategoryId: string;
  onSelect: (categoryId: string) => void;
}

function MindMapFilterTabsComponent({
  categories,
  selectedCategoryId,
  onSelect,
}: MindMapFilterTabsProps) {
  const handleSelect = useCallback(
    (categoryId: string) => {
      onSelect(categoryId);
    },
    [onSelect],
  );

  const tabs = [{ id: ALL_CATEGORY_ID, name: '全部' }, ...categories];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.content}>
      {tabs.map((tab) => {
        const isActive = tab.id === selectedCategoryId;

        if (isActive) {
          return (
            <Pressable key={tab.id} onPress={() => handleSelect(tab.id)}>
              <LinearGradient
                colors={[...CATEGORY_TAB_GRADIENT]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.tabActive}>
                <Text style={styles.tabTextActive}>{tab.name}</Text>
              </LinearGradient>
            </Pressable>
          );
        }

        return (
          <Pressable
            key={tab.id}
            style={styles.tab}
            onPress={() => handleSelect(tab.id)}>
            <Text style={styles.tabText}>{tab.name}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

export const MindMapFilterTabs = memo(MindMapFilterTabsComponent);

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
    gap: 8,
    alignItems: 'center',
  },
  tab: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: CATEGORY_TAB_INACTIVE_BG,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#E8E6F2',
  },
  tabActive: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '500',
    color: APP_TEXT_COLOR,
  },
  tabTextActive: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
