import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';

import {
  STORY_LIST_COLUMN_GAP,
  STORY_LIST_HORIZONTAL_PADDING,
  STORY_LIST_MIN_COLUMN_WIDTH,
  STORY_LIST_MIN_COLUMNS,
} from '@/src/features/square/constants';
import type { Story } from '@/src/features/square/types';

export function useStoryMasonryColumns(items: Story[]): Story[][] {
  const { width } = useWindowDimensions();

  return useMemo(() => {
    const innerWidth = width - STORY_LIST_HORIZONTAL_PADDING * 2;
    const fitted = Math.floor(
      (innerWidth + STORY_LIST_COLUMN_GAP) /
        (STORY_LIST_MIN_COLUMN_WIDTH + STORY_LIST_COLUMN_GAP),
    );
    const columnCount = Math.max(STORY_LIST_MIN_COLUMNS, fitted);
    const columns: Story[][] = Array.from({ length: columnCount }, () => []);
    items.forEach((item, index) => {
      columns[index % columnCount]?.push(item);
    });
    return columns;
  }, [items, width]);
}
