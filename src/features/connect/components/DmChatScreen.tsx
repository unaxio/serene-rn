import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useCallback, useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { KeyboardStickyView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { APP_TEXT_COLOR } from '@/constants/Colors';
import { ConnectAuthGate } from '@/src/features/connect/components/ConnectAuthGate';
import { DmBubble } from '@/src/features/connect/components/DmBubble';
import { DmChatMenus } from '@/src/features/connect/components/DmChatMenus';
import { DmComposer, pickDmImages } from '@/src/features/connect/components/DmComposer';
import { useDmThread } from '@/src/features/connect/hooks/useDmThread';
import type { DmMessage } from '@/src/features/connect/types';
import { reportUser } from '@/src/features/profile/api';
import { SquarePageHeader } from '@/src/features/square/components/SquarePageHeader';
import { SQUARE_PAGE_BG } from '@/src/features/square/constants';
import { useAuthStore } from '@/src/store/authStore';
import { toastCaughtFailure } from '@/src/utils/requestError';
import { showToast } from '@/src/utils/toast';

interface DmChatScreenProps {
  conversationId: string;
  focusMessageId?: string;
}

const FOCUS_MS = 2000;

export function DmChatScreen({ conversationId, focusMessageId }: DmChatScreenProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const userId = useAuthStore((state) => state.user?.id ?? '');
  const thread = useDmThread(conversationId);
  const [active, setActive] = useState<DmMessage | null>(null);
  const [reportOpen, setReportOpen] = useState(false);
  const [reporting, setReporting] = useState(false);
  const [focusedId, setFocusedId] = useState(focusMessageId);

  useEffect(() => {
    if (!focusMessageId) {
      return;
    }
    setFocusedId(focusMessageId);
    const timer = setTimeout(() => setFocusedId(undefined), FOCUS_MS);
    return () => clearTimeout(timer);
  }, [focusMessageId]);

  const handlePickImages = useCallback(async () => {
    const files = await pickDmImages();
    if (files.length > 0) {
      await thread.sendImages(files);
    }
  }, [thread]);

  const handleReport = useCallback(
    async (reason: string, detail: string) => {
      const peerId = thread.conversation?.peer.id;
      if (!peerId) {
        return false;
      }
      setReporting(true);
      try {
        await reportUser({ userId: peerId, reason, detail });
        showToast('已提交举报');
        return true;
      } catch (error) {
        toastCaughtFailure(error);
        return false;
      } finally {
        setReporting(false);
      }
    },
    [thread.conversation?.peer.id],
  );

  return (
    <ConnectAuthGate>
      <View style={styles.root}>
        <SquarePageHeader
          title={thread.conversation?.peer.nickName ?? '私信'}
          onBack={() => router.back()}
          right={
            <Pressable onPress={() => router.push(`/connect/dm/${conversationId}/settings`)} hitSlop={8}>
              <SymbolView
                name={{ ios: 'ellipsis', android: 'more_horiz', web: 'more_horiz' }}
                size={20}
                tintColor={APP_TEXT_COLOR}
              />
            </Pressable>
          }
        />
        {thread.isError ? <Text style={styles.hint}>加载失败，下拉重试</Text> : null}
        <FlashList
          data={thread.messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <DmBubble
              message={item}
              mine={item.senderId === userId}
              highlighted={item.id === focusedId}
              onLongPress={setActive}
            />
          )}
          onEndReached={thread.loadOlder}
          onRefresh={() => void thread.refresh()}
          refreshing={thread.isRefreshing}
        />
        <KeyboardStickyView>
          <View style={{ paddingBottom: insets.bottom }}>
            <DmComposer
              blocked={thread.blocked}
              quote={thread.quote}
              onClearQuote={thread.clearQuote}
              onSendText={(content) => void thread.sendText(content)}
              onPickImages={() => void handlePickImages()}
            />
          </View>
        </KeyboardStickyView>
        <DmChatMenus
          active={active}
          mine={active?.senderId === userId}
          reportOpen={reportOpen}
          reporting={reporting}
          onCloseMenu={() => setActive(null)}
          onQuote={thread.quoteMessage}
          onDelete={(message) => void thread.hide(message.id)}
          onOpenReport={() => setReportOpen(true)}
          onCloseReport={() => setReportOpen(false)}
          onSubmitReport={handleReport}
        />
      </View>
    </ConnectAuthGate>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: SQUARE_PAGE_BG },
  hint: { textAlign: 'center', padding: 12, color: '#64748B' },
});
