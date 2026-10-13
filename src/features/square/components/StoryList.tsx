import { useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';

import { StoryCategoryTabs } from '@/src/features/square/components/StoryCategoryTabs';
import { StoryListStatus } from '@/src/features/square/components/StoryListStatus';
import { StoryMasonry } from '@/src/features/square/components/StoryMasonry';
import {
  ACCENT_COLOR,
  ALL_TOPIC_CATEGORY,
  SQUARE_PAGE_BG,
  STORY_LIST_HORIZONTAL_PADDING,
} from '@/src/features/square/constants';
import { useStories } from '@/src/features/square/hooks/useStories';
import { useStoryFeedImpressions } from '@/src/features/square/hooks/useStoryFeedImpressions';
import { useStoryMasonryColumns } from '@/src/features/square/hooks/useStoryMasonryColumns';
import { enqueueStoryFeedEvent } from '@/src/features/square/utils/storyFeedEvents';

const LOAD_MORE_OFFSET = 240;

interface StoryListProps {
  active?: boolean;
}

export function StoryList({ active = true }: StoryListProps) {
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
  const storyIds = useMemo(() => items.map((item) => item.id), [items]);
  const { setMasonryOffset, setCardFrame, updateViewport, setViewportHeight } =
    useStoryFeedImpressions(storyIds, active);
  const columns = useStoryMasonryColumns(items);

  const handlePress = useCallback(
    (storyId: string) => {
      enqueueStoryFeedEvent({ storyId, type: 'click' });
      router.push(`/stories/${storyId}`);
    },
    [router],
  );

  const handleScroll = useCallback(
    (offsetY: number, viewportHeight: number, contentHeight: number) => {
      updateViewport(offsetY, viewportHeight);
      if (offsetY + viewportHeight >= contentHeight - LOAD_MORE_OFFSET) {
        loadMore();
      }
    },
    [loadMore, updateViewport],
  );

  const listEmpty = (() => {
    if (isLoading) {
      return <ActivityIndicator style={styles.status} color={ACCENT_COLOR} />;
    }
    if (isError) {
      return <StoryListStatus message="加载失败，请稍后重试" onRetry={() => void refetch()} />;
    }
    return <StoryListStatus message="暂无故事" />;
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
              void refresh({ manual: true });
            }}
          />
        }
        onLayout={(event) => {
          setViewportHeight(event.nativeEvent.layout.height);
        }}
        onScroll={(event) => {
          const { contentOffset, layoutMeasurement, contentSize } = event.nativeEvent;
          handleScroll(contentOffset.y, layoutMeasurement.height, contentSize.height);
        }}
        scrollEventThrottle={16}>
        {items.length === 0 ? (
          listEmpty
        ) : (
          <StoryMasonry
            columns={columns}
            onMasonryOffset={setMasonryOffset}
            onCardFrame={setCardFrame}
            onPress={handlePress}
          />
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
  status: {
    paddingVertical: 48,
  },
  footer: {
    paddingVertical: 16,
  },
});
