import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { SquareSearchHeader } from '@/src/features/square/components/search/SquareSearchHeader';
import { SquareSearchList } from '@/src/features/square/components/search/SquareSearchList';
import {
  PAGE_SURFACE_COLOR,
  SEARCH_KEYWORD_EMPTY,
  SEARCH_KEYWORD_MAX_LENGTH,
  SEARCH_KEYWORD_TOO_LONG,
} from '@/src/features/square/constants';
import { useSquareSearch } from '@/src/features/square/hooks/useSquareSearch';
import type { SquareSearchItem } from '@/src/features/square/types';
import { armCommentFocus } from '@/src/features/square/utils/commentFocusCue';
import { enqueueContentEvent } from '@/src/features/square/utils/contentEvents';
import { showToast } from '@/src/utils/toast';

export function SquareSearchScreen() {
  const router = useRouter();
  const [input, setInput] = useState('');
  const [keyword, setKeyword] = useState('');
  const search = useSquareSearch(keyword);

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
    setKeyword(trimmed);
  }, [input]);

  const handlePressItem = useCallback(
    (item: SquareSearchItem) => {
      if (item.type === 'story') {
        if (item.commentId) {
          armCommentFocus({ highlightId: item.commentId });
        }
        router.push(`/stories/${item.id}`);
        return;
      }
      if (item.type === 'share') {
        enqueueContentEvent({ targetType: 'share', targetId: item.id, type: 'click' });
        router.push(`/shares/${item.id}`);
        return;
      }
      if (item.type === 'ask_answer') {
        const askId = item.askId?.trim() ?? '';
        if (askId.length === 0) {
          return;
        }
        enqueueContentEvent({ targetType: 'ask_answer', targetId: item.id, type: 'click' });
        router.push(`/asks/${askId}`);
        return;
      }
      router.push(`/asks/${item.id}`);
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
