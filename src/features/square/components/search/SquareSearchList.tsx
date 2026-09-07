import { FlashList } from '@shopify/flash-list';
import { useCallback } from 'react';
import { ActivityIndicator, RefreshControl, StyleSheet, View } from 'react-native';

import { AskListStatus } from '@/src/features/square/components/ask/AskListStatus';
import { SquareSearchResultItem } from '@/src/features/square/components/search/SquareSearchResultItem';
import {
  ACCENT_COLOR,
  ASK_LIST_END_REACHED_THRESHOLD,
  SEARCH_EMPTY_HINT,
  SEARCH_LOAD_ERROR,
  SEARCH_NO_RESULT,
  SQUARE_PAGE_BG,
  STORY_LIST_COLUMN_GAP,
  STORY_LIST_HORIZONTAL_PADDING,
} from '@/src/features/square/constants';
import type { SquareSearchItem } from '@/src/features/square/types';

interface SquareSearchListProps {
  items: SquareSearchItem[];
  isIdle: boolean;
  isLoading: boolean;
  isError: boolean;
  isRefreshing: boolean;
  isFetchingMore: boolean;
  onPressItem: (item: SquareSearchItem) => void;
  onLoadMore: () => void;
  onRefresh: () => void;
  onRetry: () => void;
}

export function SquareSearchList({
  items,
  isIdle,
  isLoading,
  isError,
  isRefreshing,
  isFetchingMore,
  onPressItem,
  onLoadMore,
  onRefresh,
  onRetry,
}: SquareSearchListProps) {
  const listEmpty = (() => {
    if (isIdle) {
      return <AskListStatus message={SEARCH_EMPTY_HINT} />;
    }
    if (isLoading) {
      return <ActivityIndicator style={styles.status} color={ACCENT_COLOR} />;
    }
    if (isError) {
      return <AskListStatus message={SEARCH_LOAD_ERROR} onRetry={onRetry} />;
    }
    return <AskListStatus message={SEARCH_NO_RESULT} />;
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
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => `${item.type}-${item.id}`}
        onEndReached={onLoadMore}
        onEndReachedThreshold={ASK_LIST_END_REACHED_THRESHOLD}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            tintColor={ACCENT_COLOR}
            onRefresh={onRefresh}
          />
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
