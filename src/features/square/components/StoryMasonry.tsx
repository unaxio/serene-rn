import { StyleSheet, View } from 'react-native';

import { StoryCard } from '@/src/features/square/components/StoryCard';
import { STORY_LIST_COLUMN_GAP } from '@/src/features/square/constants';
import type { Story } from '@/src/features/square/types';

interface StoryMasonryProps {
  columns: Story[][];
  onMasonryOffset: (y: number) => void;
  onCardFrame: (storyId: string, y: number, height: number) => void;
  onPress: (storyId: string) => void;
}

export function StoryMasonry({
  columns,
  onMasonryOffset,
  onCardFrame,
  onPress,
}: StoryMasonryProps) {
  return (
    <View
      style={styles.masonry}
      onLayout={(event) => {
        onMasonryOffset(event.nativeEvent.layout.y);
      }}>
      {columns.map((column, columnIndex) => (
        <View key={`col-${columnIndex}`} style={styles.column}>
          {column.map((story) => (
            <StoryCard
              key={story.id}
              story={story}
              onPress={onPress}
              onFrame={onCardFrame}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  masonry: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: STORY_LIST_COLUMN_GAP,
  },
  column: {
    flex: 1,
    gap: STORY_LIST_COLUMN_GAP,
  },
});
