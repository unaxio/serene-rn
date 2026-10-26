import { FlashList } from '@shopify/flash-list';
import { useCallback } from 'react';
import { ActivityIndicator, RefreshControl, StyleSheet, View } from 'react-native';

import { AskListStatus } from '@/src/features/square/components/ask/AskListStatus';
import { SquareSearchResultItem } from '@/src/features/square/components/search/SquareSearchResultItem';
import {
  ACCENT_COLOR,
  ASK_LIST_END_REACHED_THRESHOLD,
  SQUARE_PAGE_BG,
  STORY_LIST_COLUMN_GAP,
  STORY_LIST_HORIZONTAL_PADDING,
  TOPIC_POST_EMPTY,
  TOPIC_POST_LOAD_ERROR,
} from '@/src/features/square/constants';
import { useContentImpressions } from '@/src/features/square/hooks/useContentImpressions';
import type { SquareSearchItem } from '@/src/features/square/types';

interface TopicPostListProps {
  items: SquareSearchItem[];
  blockedMessage: string;
  isLoading: boolean;
  isError: boolean;
  isRefreshing: boolean;
  isFetchingMore: boolean;
  onPressItem: (item: SquareSearchItem) => void;
  onLoadMore: () => void;
  onRefresh: () => void;
  onRetry: () => void;
}

export function TopicPostList({
  items,
  blockedMessage,
  isLoading,
  isError,
  isRefreshing,
  isFetchingMore,
  onPressItem,
  onLoadMore,
  onRefresh,
  onRetry,
}: TopicPostListProps) {
  const impressions = useContentImpressions(items, (item) => {
    if (item.type !== 'share' && item.type !== 'ask_answer') {
      return null;
    }
    return { targetType: item.type, targetId: item.id };
  });
  const listEmpty = (() => {
    if (blockedMessage.length > 0) {
      return <AskListStatus message={blockedMessage} />;
    }
    if (isLoading) {
      return <ActivityIndicator style={styles.status} color={ACCENT_COLOR} />;
    }
    if (isError) {
      return <AskListStatus message={TOPIC_POST_LOAD_ERROR} onRetry={onRetry} />;
    }
    return <AskListStatus message={TOPIC_POST_EMPTY} />;
  })();

  const renderItem = useCallback(
    ({ item }: { item: SquareSearchItem }) => (
      <SquareSearchResultItem item={item} onPress={onPressItem} />
    ),
    [onPressItem],
  );

  return (
    <View style={styles.root}>
      <FlashList
        data={blockedMessage.length > 0 ? [] : items}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.type}-${item.id}-${item.commentId ?? ''}-${index}`}
        onViewableItemsChanged={impressions.onViewableItemsChanged}
        viewabilityConfig={impressions.viewabilityConfig}
        onEndReached={blockedMessage.length > 0 ? undefined : onLoadMore}
        onEndReachedThreshold={ASK_LIST_END_REACHED_THRESHOLD}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} tintColor={ACCENT_COLOR} onRefresh={onRefresh} />
        }
        ListEmptyComponent={listEmpty}
        ListFooterComponent={
          isFetchingMore ? <ActivityIndicator style={styles.footer} color={ACCENT_COLOR} /> : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: SQUARE_PAGE_BG,
  },
  listContent: {
    paddingHorizontal: STORY_LIST_HORIZONTAL_PADDING,
    paddingTop: 8,
    paddingBottom: 24,
    backgroundColor: SQUARE_PAGE_BG,
  },
  separator: {
    height: STORY_LIST_COLUMN_GAP,
  },
  status: {
    paddingVertical: 48,
  },
  footer: {
    paddingVertical: 16,
  },
});
