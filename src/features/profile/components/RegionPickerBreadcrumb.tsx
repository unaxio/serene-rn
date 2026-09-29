import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';

import { APP_TEXT_COLOR } from '@/constants/Colors';
import { PROFILE_ACCENT, REGION_BREADCRUMB_HINT } from '@/src/features/profile/constants';
import type { RegionPathItem } from '@/src/features/profile/regionTypes';

interface RegionPickerBreadcrumbProps {
  crumbs: RegionPathItem[];
  onJump: (index: number) => void;
}

const CRUMB_SEPARATOR = ' › ';
const BREADCRUMB_FONT_SIZE = 14;
const BREADCRUMB_LINE_HEIGHT = 20;
const BREADCRUMB_VERTICAL_PADDING = 10;
const BREADCRUMB_HORIZONTAL_PADDING = 16;
const BREADCRUMB_HEIGHT = BREADCRUMB_LINE_HEIGHT + BREADCRUMB_VERTICAL_PADDING * 2;

export function RegionPickerBreadcrumb({ crumbs, onJump }: RegionPickerBreadcrumbProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.scroll}
      contentContainerStyle={styles.row}>
      {crumbs.map((crumb, index) => (
        <Pressable key={crumb.code} onPress={() => onJump(index)} hitSlop={8}>
          <Text style={styles.crumb}>
            {crumb.name}
            {CRUMB_SEPARATOR}
          </Text>
        </Pressable>
      ))}
      <Text style={styles.hint}>{REGION_BREADCRUMB_HINT}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 0,
    flexShrink: 0,
    height: BREADCRUMB_HEIGHT,
    marginBottom: 4,
  },
  row: {
    alignItems: 'center',
    height: BREADCRUMB_HEIGHT,
    paddingHorizontal: BREADCRUMB_HORIZONTAL_PADDING,
  },
  crumb: {
    fontSize: BREADCRUMB_FONT_SIZE,
    lineHeight: BREADCRUMB_LINE_HEIGHT,
    color: APP_TEXT_COLOR,
  },
  hint: {
    fontSize: BREADCRUMB_FONT_SIZE,
    lineHeight: BREADCRUMB_LINE_HEIGHT,
    fontWeight: '600',
    color: PROFILE_ACCENT,
  },
});
