import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { SquareSearchHeader } from '@/src/features/square/components/search/SquareSearchHeader';
import { SquareSearchList } from '@/src/features/square/components/search/SquareSearchList';
import { PAGE_SURFACE_COLOR } from '@/src/features/square/constants';
import { useSquareSearch } from '@/src/features/square/hooks/useSquareSearch';
import type { SquareSearchItem } from '@/src/features/square/types';

export function SquareSearchScreen() {
  const router = useRouter();
  const [input, setInput] = useState('');
  const [keyword, setKeyword] = useState('');
  const search = useSquareSearch(keyword);

  const handleSubmit = useCallback(() => {
    setKeyword(input.trim());
  }, [input]);

  const handlePressItem = useCallback(
    (item: SquareSearchItem) => {
      if (item.type === 'story') {
        router.push(`/stories/${item.id}`);
        return;
      }
      if (item.type === 'ask') {
        router.push(`/asks/${item.id}`);
      }
    },
    [router],
  );

  return (
    <View style={styles.root}>
      <SquareSearchHeader
        value={input}
        onChange={setInput}
        onSubmit={handleSubmit}
        onBack={() => router.back()}
      />
      <SquareSearchList
        items={search.items}
        isIdle={search.isIdle}
        isLoading={search.isLoading}
        isError={search.isError}
        isRefreshing={search.isRefreshing}
        isFetchingMore={search.isFetchingMore}
        onPressItem={handlePressItem}
        onLoadMore={search.loadMore}
        onRefresh={() => {
          void search.refresh();
        }}
        onRetry={() => {
          void search.refresh();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: PAGE_SURFACE_COLOR,
  },
});
