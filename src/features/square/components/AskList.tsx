import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import { useCallback } from 'react';
import { ActivityIndicator, RefreshControl, StyleSheet, View } from 'react-native';

import { AskCard } from '@/src/features/square/components/ask/AskCard';
import { AskListStatus } from '@/src/features/square/components/ask/AskListStatus';
import {
  ACCENT_COLOR,
  ASK_LIST_EMPTY_MESSAGE,
  ASK_LIST_END_REACHED_THRESHOLD,
  SQUARE_PAGE_BG,
  STORY_LIST_COLUMN_GAP,
  STORY_LIST_HORIZONTAL_PADDING,
} from '@/src/features/square/constants';
import { useAsks } from '@/src/features/square/hooks/useAsks';
import type { Ask } from '@/src/features/square/types';

export function AskList() {
  const router = useRouter();
  const { items, isLoading, isError, isRefreshing, isFetchingMore, loadMore, refresh, refetch } =
    useAsks();

  const handlePress = useCallback(
    (askId: string) => {
      router.push(`/asks/${askId}`);
    },
    [router],
  );

  const renderItem = useCallback(
    ({ item }: { item: Ask }) => <AskCard ask={item} onPress={handlePress} />,
    [handlePress],
  );

  const listEmpty = (() => {
    if (isLoading) {
      return <ActivityIndicator style={styles.status} color={ACCENT_COLOR} />;
    }
    if (isError) {
      return <AskListStatus message="加载失败，请稍后重试" onRetry={() => void refetch()} />;
    }
    return <AskListStatus message={ASK_LIST_EMPTY_MESSAGE} />;
  })();

  return (
    <View style={styles.root}>
      <FlashList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        onEndReached={loadMore}
        onEndReachedThreshold={ASK_LIST_END_REACHED_THRESHOLD}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            tintColor={ACCENT_COLOR}
            onRefresh={() => {
              void refresh();
            }}
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
