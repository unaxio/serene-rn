import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { StoryCard } from '@/src/features/square/components/StoryCard';
import { StoryCategoryTabs } from '@/src/features/square/components/StoryCategoryTabs';
import {
  ACCENT_COLOR,
  ALL_TOPIC_CATEGORY,
  MUTED_TEXT_COLOR,
  SQUARE_PAGE_BG,
  STORY_LIST_COLUMN_GAP,
  STORY_LIST_HORIZONTAL_PADDING,
} from '@/src/features/square/constants';
import { useStories } from '@/src/features/square/hooks/useStories';
import { useStoryMasonryColumns } from '@/src/features/square/hooks/useStoryMasonryColumns';
import type { Story } from '@/src/features/square/types';

const LOAD_MORE_OFFSET = 240;

function ListStatus({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <View style={styles.status}>
      <Text style={styles.statusText}>{message}</Text>
      {onRetry ? (
        <Pressable onPress={onRetry}>
          <Text style={styles.retry}>重试</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export function StoryList() {
  const router = useRouter();
  const [category, setCategory] = useState(ALL_TOPIC_CATEGORY);
  const {
    items,
    isLoading,
    isError,
    isRefreshing,
    isFetchingMore,
    loadMore,
    refresh,
    refetch,
  } = useStories(category);
  const columns = useStoryMasonryColumns(items);

  const handlePress = useCallback(
    (storyId: string) => {
      router.push(`/stories/${storyId}`);
    },
    [router],
  );

  const handleScroll = useCallback(
    (offsetY: number, viewportHeight: number, contentHeight: number) => {
      if (offsetY + viewportHeight >= contentHeight - LOAD_MORE_OFFSET) {
        loadMore();
      }
    },
    [loadMore],
  );

  const listEmpty = (() => {
    if (isLoading) {
      return <ActivityIndicator style={styles.status} color={ACCENT_COLOR} />;
    }
    if (isError) {
      return <ListStatus message="加载失败，请稍后重试" onRetry={() => void refetch()} />;
    }
    return <ListStatus message="暂无故事" />;
  })();

  return (
    <View style={styles.root}>
      <StoryCategoryTabs selectedId={category} onSelect={setCategory} />
      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            tintColor={ACCENT_COLOR}
            onRefresh={() => {
              void refresh();
            }}
          />
        }
        onScroll={(event) => {
          const { contentOffset, layoutMeasurement, contentSize } = event.nativeEvent;
          handleScroll(contentOffset.y, layoutMeasurement.height, contentSize.height);
        }}
        scrollEventThrottle={16}>
        {items.length === 0 ? (
          listEmpty
        ) : (
          <View style={styles.masonry}>
            {columns.map((column, columnIndex) => (
              <View key={`col-${columnIndex}`} style={styles.column}>
                {column.map((story: Story) => (
                  <StoryCard key={story.id} story={story} onPress={handlePress} />
                ))}
              </View>
            ))}
          </View>
        )}
        {isFetchingMore ? <ActivityIndicator style={styles.footer} color={ACCENT_COLOR} /> : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  list: {
    flex: 1,
    backgroundColor: SQUARE_PAGE_BG,
  },
  listContent: {
    paddingHorizontal: STORY_LIST_HORIZONTAL_PADDING,
    paddingTop: 8,
    paddingBottom: 24,
    flexGrow: 1,
  },
  masonry: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: STORY_LIST_COLUMN_GAP,
  },
  column: {
    flex: 1,
    gap: STORY_LIST_COLUMN_GAP,
  },
  status: {
    paddingVertical: 48,
    alignItems: 'center',
    gap: 8,
  },
  statusText: {
    fontSize: 14,
    color: MUTED_TEXT_COLOR,
  },
  retry: {
    fontSize: 14,
    fontWeight: '600',
    color: ACCENT_COLOR,
  },
  footer: {
    paddingVertical: 16,
  },
});
