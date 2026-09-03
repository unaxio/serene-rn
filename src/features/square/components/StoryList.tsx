import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
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
} from '@/src/features/square/constants';
import { useStories } from '@/src/features/square/hooks/useStories';
import type { Story } from '@/src/features/square/types';

const END_REACHED_THRESHOLD = 0.4;

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

  const handlePress = useCallback(
    (storyId: string) => {
      router.push(`/stories/${storyId}`);
    },
    [router],
  );

  const renderItem = useCallback(
    ({ item }: { item: Story }) => <StoryCard story={item} onPress={handlePress} />,
    [handlePress],
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
      <FlashList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        onEndReached={loadMore}
        onEndReachedThreshold={END_REACHED_THRESHOLD}
        refreshing={isRefreshing}
        onRefresh={() => {
          void refresh();
        }}
        ListEmptyComponent={listEmpty}
        ListFooterComponent={
          isFetchingMore ? (
            <ActivityIndicator style={styles.footer} color={ACCENT_COLOR} />
          ) : null
        }
        style={styles.list}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingTop: 4,
    paddingBottom: 24,
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
