import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { SquareSearchDiscover } from '@/src/features/square/components/search/SquareSearchDiscover';
import { SquareSearchHeader } from '@/src/features/square/components/search/SquareSearchHeader';
import { SquareSearchList } from '@/src/features/square/components/search/SquareSearchList';
import {
  PAGE_SURFACE_COLOR,
  SEARCH_KEYWORD_EMPTY,
  SEARCH_KEYWORD_MAX_LENGTH,
  SEARCH_KEYWORD_TOO_LONG,
} from '@/src/features/square/constants';
import { useSearchDiscover } from '@/src/features/square/hooks/useSearchDiscover';
import { useSquareSearch } from '@/src/features/square/hooks/useSquareSearch';
import { useSquareSearchNavigation } from '@/src/features/square/hooks/useSquareSearchNavigation';
import { showToast } from '@/src/utils/toast';

export function SquareSearchScreen() {
  const router = useRouter();
  const [input, setInput] = useState('');
  const [keyword, setKeyword] = useState('');
  const search = useSquareSearch(keyword);
  const discover = useSearchDiscover();
  const navigation = useSquareSearchNavigation(discover.removeHot);

  const handleChange = useCallback((value: string) => {
    setInput(value);
    if (value.trim().length === 0) {
      setKeyword('');
    }
  }, []);

  const handleSubmit = useCallback(() => {
    const trimmed = input.trim();
    if (trimmed.length === 0) {
      showToast(SEARCH_KEYWORD_EMPTY);
      return;
    }
    if (trimmed.length > SEARCH_KEYWORD_MAX_LENGTH) {
      showToast(SEARCH_KEYWORD_TOO_LONG);
      return;
    }
    setInput(trimmed);
    discover.rememberKeyword(trimmed);
    setKeyword(trimmed);
  }, [discover, input]);

  const handlePickHistory = useCallback(
    (term: string) => {
      setInput(term);
      discover.rememberKeyword(term);
      setKeyword(term);
    },
    [discover],
  );

  return (
    <View style={styles.root}>
      <SquareSearchHeader
        value={input}
        onChange={handleChange}
        onSubmit={handleSubmit}
        onBack={() => router.back()}
      />
      {input.trim().length === 0 ? (
        <SquareSearchDiscover
          history={discover.history}
          stories={discover.stories}
          asks={discover.asks}
          loading={discover.loading}
          refreshing={discover.refreshing}
          hotFailed={discover.hotFailed}
          onPickHistory={handlePickHistory}
          onClearHistory={() => {
            void discover.clearHistory();
          }}
          onPressStory={(id) => {
            void navigation.openHot('story', id);
          }}
          onPressAsk={(id) => {
            void navigation.openHot('ask', id);
          }}
          onRefresh={() => {
            void discover.refreshHot();
          }}
          onRetry={() => {
            void discover.refreshHot();
          }}
        />
      ) : (
        <SquareSearchList
          items={search.items}
          isIdle={false}
          isLoading={search.isLoading}
          isError={search.isError}
          isRefreshing={search.isRefreshing}
          isFetchingMore={search.isFetchingMore}
          onPressItem={navigation.handlePressItem}
          onLoadMore={search.loadMore}
          onRefresh={() => {
            void search.refresh();
          }}
          onRetry={() => {
            void search.refresh();
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: PAGE_SURFACE_COLOR,
  },
});
