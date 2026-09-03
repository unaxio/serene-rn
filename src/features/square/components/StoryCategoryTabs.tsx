import { memo, useCallback } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { APP_TEXT_COLOR } from '@/constants/Colors';
import {
  ACCENT_COLOR,
  MUTED_TEXT_COLOR,
  STORY_TOPIC_TABS,
} from '@/src/features/square/constants';

interface StoryCategoryTabsProps {
  selectedId: string;
  onSelect: (id: string) => void;
}

const INDICATOR_HEIGHT = 2;
const TAB_GAP = 24;
const TAB_VERTICAL_PADDING = 14;
const TAB_FONT_SIZE = 15;

function StoryCategoryTabsComponent({ selectedId, onSelect }: StoryCategoryTabsProps) {
  const handleSelect = useCallback(
    (id: string) => {
      onSelect(id);
    },
    [onSelect],
  );

  return (
    <View style={styles.wrap}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scroll}
        contentContainerStyle={styles.content}>
        {STORY_TOPIC_TABS.map((tab) => {
          const isActive = tab.id === selectedId;
          return (
            <Pressable
              key={tab.id}
              style={styles.tab}
              onPress={() => handleSelect(tab.id)}>
              <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                {tab.name}
              </Text>
              <View style={[styles.indicator, isActive && styles.indicatorActive]} />
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

export const StoryCategoryTabs = memo(StoryCategoryTabsComponent);

const styles = StyleSheet.create({
  wrap: {
    flexGrow: 0,
    flexShrink: 0,
  },
  scroll: {
    flexGrow: 0,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 4,
    gap: TAB_GAP,
    alignItems: 'flex-end',
  },
  tab: {
    alignItems: 'center',
    paddingTop: TAB_VERTICAL_PADDING,
    paddingBottom: 4,
  },
  tabText: {
    fontSize: TAB_FONT_SIZE,
    fontWeight: '500',
    color: MUTED_TEXT_COLOR,
  },
  tabTextActive: {
    fontWeight: '700',
    color: APP_TEXT_COLOR,
  },
  indicator: {
    marginTop: 8,
    height: INDICATOR_HEIGHT,
    alignSelf: 'stretch',
    backgroundColor: 'transparent',
  },
  indicatorActive: {
    backgroundColor: ACCENT_COLOR,
  },
});
