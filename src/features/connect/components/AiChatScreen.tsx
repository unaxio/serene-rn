import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { BackHandler, Pressable, StyleSheet, Text, View } from 'react-native';
import { KeyboardStickyView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { APP_TEXT_COLOR } from '@/constants/Colors';
import { endAiSession } from '@/src/features/connect/api';
import { AiChatComposer } from '@/src/features/connect/components/AiChatComposer';
import { ConnectAuthGate } from '@/src/features/connect/components/ConnectAuthGate';
import { useAiChat } from '@/src/features/connect/hooks/useAiChat';
import type { AiChatBubble } from '@/src/features/connect/types';
import { clearAiSessionDraft } from '@/src/features/connect/utils/aiSessionDraft';
import { ConfirmDangerModal } from '@/src/features/square/components/ConfirmDangerModal';
import { SquarePageHeader } from '@/src/features/square/components/SquarePageHeader';
import { MUTED_TEXT_COLOR, SQUARE_PAGE_BG } from '@/src/features/square/constants';
import { toastCaughtFailure } from '@/src/utils/requestError';

interface AiChatScreenProps {
  sessionId: string;
}

const BUBBLE_RADIUS = 12;

export function AiChatScreen({ sessionId }: AiChatScreenProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const chat = useAiChat(sessionId);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [ending, setEnding] = useState(false);

  const askEnd = useCallback(() => setConfirmVisible(true), []);

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      setConfirmVisible(true);
      return true;
    });
    return () => sub.remove();
  }, []);

  const handleEnd = useCallback(async () => {
    setEnding(true);
    chat.abort();
    try {
      await endAiSession(sessionId);
      clearAiSessionDraft();
      router.dismissTo('/(tabs)/connect');
    } catch (error) {
      toastCaughtFailure(error);
      setEnding(false);
    }
  }, [chat, router, sessionId]);

  const renderItem = useCallback(
    ({ item }: { item: AiChatBubble }) => (
      <View style={[styles.bubble, item.role === 'user' ? styles.mine : styles.theirs]}>
        <Text style={item.role === 'user' ? styles.mineText : styles.theirsText}>
          {item.content || (item.pending ? '…' : '')}
        </Text>
        {item.failed ? (
          <Pressable onPress={() => chat.retry(item)}>
            <Text style={styles.retry}>重试</Text>
          </Pressable>
        ) : null}
      </View>
    ),
    [chat],
  );

  return (
    <ConnectAuthGate>
      <View style={styles.root}>
        <SquarePageHeader title={chat.roleName} onBack={askEnd} />
        {chat.ready ? (
          <FlashList data={chat.messages} renderItem={renderItem} keyExtractor={(item) => item.id} />
        ) : (
          <Text style={styles.missing}>这次对话已结束</Text>
        )}
        <KeyboardStickyView offset={{ closed: 0, opened: 0 }}>
          <View style={{ paddingBottom: insets.bottom }}>
            <AiChatComposer disabled={!chat.ready || chat.generating} onSend={(content) => void chat.send(content)} />
          </View>
        </KeyboardStickyView>
        <ConfirmDangerModal
          visible={confirmVisible}
          title="结束对话"
          message="结束后本次对话内容不会保留"
          confirmLabel="结束"
          cancelLabel="返回对话"
          isSubmitting={ending}
          onCancel={() => setConfirmVisible(false)}
          onConfirm={() => void handleEnd()}
        />
      </View>
    </ConnectAuthGate>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: SQUARE_PAGE_BG },
  missing: { textAlign: 'center', marginTop: 40, color: MUTED_TEXT_COLOR },
  bubble: { marginHorizontal: 16, marginVertical: 6, maxWidth: '80%', padding: 10, borderRadius: BUBBLE_RADIUS },
  mine: { alignSelf: 'flex-end', backgroundColor: '#7B6CF9' },
  theirs: { alignSelf: 'flex-start', backgroundColor: '#FFFFFF' },
  mineText: { color: '#FFFFFF', fontSize: 15 },
  theirsText: { color: APP_TEXT_COLOR, fontSize: 15 },
  retry: { marginTop: 6, color: '#DC2626', fontSize: 12 },
});
