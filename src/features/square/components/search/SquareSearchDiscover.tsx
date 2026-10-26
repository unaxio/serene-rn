import { ActivityIndicator, Pressable, RefreshControl, ScrollView, Text, View } from 'react-native';

import { SearchHotBoard } from '@/src/features/square/components/search/SearchHotBoard';
import { searchDiscoverStyles as styles } from '@/src/features/square/components/search/searchDiscoverStyles';
import {
  ACCENT_COLOR,
  SEARCH_HISTORY_CLEAR,
  SEARCH_HISTORY_TITLE,
  SEARCH_HOT_ASK_TITLE,
  SEARCH_HOT_EMPTY,
  SEARCH_HOT_LOAD_ERROR,
  SEARCH_HOT_STORY_TITLE,
} from '@/src/features/square/constants';
import type { SearchHotItem } from '@/src/features/square/types';

interface SquareSearchDiscoverProps {
  history: string[];
  stories: SearchHotItem[];
  asks: SearchHotItem[];
  loading: boolean;
  refreshing: boolean;
  hotFailed: boolean;
  onPickHistory: (keyword: string) => void;
  onClearHistory: () => void;
  onPressStory: (id: string) => void;
  onPressAsk: (id: string) => void;
  onRefresh: () => void;
  onRetry: () => void;
}

export function SquareSearchDiscover({
  history,
  stories,
  asks,
  loading,
  refreshing,
  hotFailed,
  onPickHistory,
  onClearHistory,
  onPressStory,
  onPressAsk,
  onRefresh,
  onRetry,
}: SquareSearchDiscoverProps) {
  const hotEmpty = stories.length === 0 && asks.length === 0;

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={ACCENT_COLOR} />}
    >
      {loading ? <ActivityIndicator style={styles.status} color={ACCENT_COLOR} /> : null}
      {!loading && history.length > 0 ? (
        <View style={styles.section}>
          <View style={styles.head}>
            <Text style={styles.heading}>{SEARCH_HISTORY_TITLE}</Text>
            <Pressable onPress={onClearHistory} hitSlop={8}>
              <Text style={styles.clear}>{SEARCH_HISTORY_CLEAR}</Text>
            </Pressable>
          </View>
          <View style={styles.chips}>
            {history.map((keyword) => (
              <Pressable key={keyword} style={styles.chip} onPress={() => onPickHistory(keyword)}>
                <Text style={styles.chipText} numberOfLines={1}>
                  {keyword}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      ) : null}
      {!loading ? <SearchHotBoard title={SEARCH_HOT_STORY_TITLE} items={stories} onPress={onPressStory} /> : null}
      {!loading ? <SearchHotBoard title={SEARCH_HOT_ASK_TITLE} items={asks} onPress={onPressAsk} /> : null}
      {!loading && hotEmpty ? (
        <Pressable disabled={!hotFailed} onPress={onRetry}>
          <Text style={styles.status}>{hotFailed ? SEARCH_HOT_LOAD_ERROR : SEARCH_HOT_EMPTY}</Text>
        </Pressable>
      ) : null}
    </ScrollView>
  );
}
