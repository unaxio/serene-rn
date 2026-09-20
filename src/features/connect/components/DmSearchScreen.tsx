import { useQuery } from '@tanstack/react-query';
import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { APP_TEXT_COLOR } from '@/constants/Colors';
import { searchDmMessages } from '@/src/features/connect/api';
import { ConnectAuthGate } from '@/src/features/connect/components/ConnectAuthGate';
import {
  CONNECT_EMPTY_SEARCH,
  CONNECT_PAGE_SIZE,
  CONNECT_QUERY_KEYS,
  CONNECT_SEARCH_DEBOUNCE_MS,
} from '@/src/features/connect/constants';
import { SquarePageHeader } from '@/src/features/square/components/SquarePageHeader';
import { MUTED_TEXT_COLOR, PLACEHOLDER_TEXT_COLOR, SQUARE_PAGE_BG } from '@/src/features/square/constants';
import { formatRelativeTime } from '@/src/features/square/utils/formatRelativeTime';

interface DmSearchScreenProps {
  conversationId: string;
}

export function DmSearchScreen({ conversationId }: DmSearchScreenProps) {
  const router = useRouter();
  const [keyword, setKeyword] = useState('');
  const [debounced, setDebounced] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(keyword.trim()), CONNECT_SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [keyword]);

  const query = useQuery({
    queryKey: CONNECT_QUERY_KEYS.dmSearch(conversationId, debounced),
    queryFn: () => searchDmMessages(conversationId, debounced, 1, CONNECT_PAGE_SIZE),
    enabled: debounced.length > 0,
  });

  return (
    <ConnectAuthGate>
      <View style={styles.root}>
        <SquarePageHeader title="搜索聊天记录" onBack={() => router.back()} />
        <TextInput
          style={styles.input}
          value={keyword}
          onChangeText={setKeyword}
          placeholder="搜索"
          placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
          returnKeyType="search"
          onSubmitEditing={() => setDebounced(keyword.trim())}
        />
        <FlashList
          data={query.data?.items ?? []}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Pressable
              style={styles.hit}
              onPress={() =>
                router.push({
                  pathname: '/connect/dm/[conversationId]',
                  params: { conversationId, focusMessageId: item.id },
                })
              }>
              <Text style={styles.name}>{item.senderName}</Text>
              <Text style={styles.snippet}>{item.snippet}</Text>
              <Text style={styles.time}>{formatRelativeTime(item.createdAt)}</Text>
            </Pressable>
          )}
          ListEmptyComponent={
            <Text style={styles.empty}>
              {debounced.length === 0 ? '输入关键词搜索' : query.isError ? '搜索失败' : CONNECT_EMPTY_SEARCH}
            </Text>
          }
        />
      </View>
    </ConnectAuthGate>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: SQUARE_PAGE_BG },
  input: {
    margin: 16,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: APP_TEXT_COLOR,
  },
  hit: { paddingHorizontal: 16, paddingVertical: 12, gap: 4, backgroundColor: '#FFFFFF' },
  name: { fontSize: 14, fontWeight: '600', color: APP_TEXT_COLOR },
  snippet: { fontSize: 14, color: APP_TEXT_COLOR },
  time: { fontSize: 11, color: MUTED_TEXT_COLOR },
  empty: { textAlign: 'center', color: MUTED_TEXT_COLOR, padding: 24 },
});
