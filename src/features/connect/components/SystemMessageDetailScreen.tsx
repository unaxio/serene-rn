import { Image } from 'expo-image';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { APP_TEXT_COLOR } from '@/constants/Colors';
import { getSystemMessage } from '@/src/features/connect/api';
import { ConnectAuthGate } from '@/src/features/connect/components/ConnectAuthGate';
import {
  CONNECT_QUERY_KEYS,
  CONNECT_UNAVAILABLE_MESSAGE,
  CONNECT_WITHDRAWN_MESSAGE,
} from '@/src/features/connect/constants';
import { openConnectLink } from '@/src/features/connect/utils/openConnectLink';
import { SquarePageHeader } from '@/src/features/square/components/SquarePageHeader';
import { ACCENT_COLOR, MUTED_TEXT_COLOR, SQUARE_PAGE_BG } from '@/src/features/square/constants';
import { resolveCdnUrl } from '@/src/utils/cdn';
import { useAuthStore } from '@/src/store/authStore';

interface SystemMessageDetailScreenProps {
  messageId: string;
}

const IMAGE_HEIGHT = 180;

export function SystemMessageDetailScreen({ messageId }: SystemMessageDetailScreenProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const markedRef = useRef(false);
  const isAuthenticated = useAuthStore((state) => state.status === 'authenticated');
  const query = useQuery({
    queryKey: CONNECT_QUERY_KEYS.systemDetail(messageId),
    queryFn: () => getSystemMessage(messageId),
    enabled: isAuthenticated && messageId.length > 0,
  });

  useEffect(() => {
    if (!query.data || markedRef.current) {
      return;
    }
    markedRef.current = true;
    void queryClient.invalidateQueries({ queryKey: CONNECT_QUERY_KEYS.notifications('system') });
    void queryClient.invalidateQueries({ queryKey: CONNECT_QUERY_KEYS.unread });
    void queryClient.invalidateQueries({ queryKey: CONNECT_QUERY_KEYS.home });
  }, [query.data, queryClient]);

  const detail = query.data;

  return (
    <ConnectAuthGate>
      <View style={styles.root}>
        <SquarePageHeader title="系统消息" onBack={() => router.back()} />
        {query.isLoading ? <ActivityIndicator color={ACCENT_COLOR} style={styles.status} /> : null}
        {query.isError ? <Text style={styles.status}>{CONNECT_UNAVAILABLE_MESSAGE}</Text> : null}
        {detail?.withdrawn ? <Text style={styles.status}>{CONNECT_WITHDRAWN_MESSAGE}</Text> : null}
        {detail && !detail.withdrawn ? (
          <ScrollView contentContainerStyle={styles.content}>
            <Text style={styles.title}>{detail.title}</Text>
            <Text style={styles.body}>{detail.body}</Text>
            {detail.images.map((path) => {
              const uri = resolveCdnUrl(path);
              return uri ? (
                <Image key={path} source={{ uri }} style={styles.image} contentFit="cover" />
              ) : null;
            })}
            {detail.action ? (
              <Pressable style={styles.button} onPress={() => openConnectLink(router, detail.action?.link ?? null)}>
                <Text style={styles.buttonText}>{detail.action.label}</Text>
              </Pressable>
            ) : null}
          </ScrollView>
        ) : null}
      </View>
    </ConnectAuthGate>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: SQUARE_PAGE_BG },
  status: { textAlign: 'center', marginTop: 32, color: MUTED_TEXT_COLOR },
  content: { padding: 16, gap: 12 },
  title: { fontSize: 18, fontWeight: '700', color: APP_TEXT_COLOR },
  body: { fontSize: 15, lineHeight: 22, color: APP_TEXT_COLOR },
  image: { width: '100%', height: IMAGE_HEIGHT, borderRadius: 12 },
  button: {
    alignSelf: 'flex-start',
    backgroundColor: ACCENT_COLOR,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  buttonText: { color: '#FFFFFF', fontWeight: '700' },
});
