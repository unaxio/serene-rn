import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppSwitch } from '@/src/components/AppSwitch';
import { APP_TEXT_COLOR } from '@/constants/Colors';
import { clearDmMessages, updateDmSettings } from '@/src/features/connect/api';
import { ConnectAuthGate } from '@/src/features/connect/components/ConnectAuthGate';
import { CONNECT_QUERY_KEYS } from '@/src/features/connect/constants';
import { useDmThread } from '@/src/features/connect/hooks/useDmThread';
import { addBlacklist, removeBlacklist } from '@/src/features/profile/api';
import { DmSettingsDialogs } from '@/src/features/connect/components/DmSettingsDialogs';
import { SquarePageHeader } from '@/src/features/square/components/SquarePageHeader';
import { SQUARE_PAGE_BG } from '@/src/features/square/constants';
import { toastCaughtFailure } from '@/src/utils/requestError';
import { showToast } from '@/src/utils/toast';

interface DmSettingsScreenProps {
  conversationId: string;
}

export function DmSettingsScreen({ conversationId }: DmSettingsScreenProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const thread = useDmThread(conversationId);
  const peer = thread.conversation?.peer;
  const [clearOpen, setClearOpen] = useState(false);
  const [blockOpen, setBlockOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const save = useCallback(
    async (payload: { muted?: boolean; pinned?: boolean }) => {
      try {
        await updateDmSettings(conversationId, payload);
        await queryClient.invalidateQueries({ queryKey: CONNECT_QUERY_KEYS.dmMessages(conversationId) });
        await queryClient.invalidateQueries({ queryKey: CONNECT_QUERY_KEYS.home });
      } catch (error) {
        toastCaughtFailure(error);
      }
    },
    [conversationId, queryClient],
  );

  const handleClear = useCallback(async () => {
    setBusy(true);
    try {
      await clearDmMessages(conversationId);
      await queryClient.invalidateQueries({ queryKey: CONNECT_QUERY_KEYS.dmMessages(conversationId) });
      showToast('已清空');
      setClearOpen(false);
    } catch (error) {
      toastCaughtFailure(error);
    } finally {
      setBusy(false);
    }
  }, [conversationId, queryClient]);

  const handleBlock = useCallback(async () => {
    if (!peer) {
      return;
    }
    setBusy(true);
    try {
      if (thread.conversation?.blockedByMe) {
        await removeBlacklist(peer.id);
      } else {
        await addBlacklist(peer.id);
      }
      await queryClient.invalidateQueries({ queryKey: CONNECT_QUERY_KEYS.dmMessages(conversationId) });
      setBlockOpen(false);
    } catch (error) {
      toastCaughtFailure(error);
    } finally {
      setBusy(false);
    }
  }, [conversationId, peer, queryClient, thread.conversation?.blockedByMe]);

  return (
    <ConnectAuthGate>
      <View style={styles.root}>
        <SquarePageHeader title="聊天设置" onBack={() => router.back()} />
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.label}>消息免打扰</Text>
            <AppSwitch
              value={thread.conversation?.muted ?? false}
              onValueChange={(value) => void save({ muted: value })}
            />
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>置顶聊天</Text>
            <AppSwitch
              value={thread.conversation?.pinned ?? false}
              onValueChange={(value) => void save({ pinned: value })}
            />
          </View>
          <Pressable style={styles.row} onPress={() => router.push(`/connect/dm/${conversationId}/search`)}>
            <Text style={styles.label}>搜索聊天记录</Text>
          </Pressable>
          <Pressable style={styles.row} onPress={() => setClearOpen(true)}>
            <Text style={styles.label}>清空聊天记录</Text>
          </Pressable>
          <Pressable style={styles.row} onPress={() => setBlockOpen(true)}>
            <Text style={styles.danger}>
              {thread.conversation?.blockedByMe ? '解除黑名单' : '加入黑名单'}
            </Text>
          </Pressable>
          <Pressable style={styles.row} onPress={() => setReportOpen(true)}>
            <Text style={styles.danger}>举报</Text>
          </Pressable>
        </View>
        <DmSettingsDialogs
          peerId={peer?.id}
          blockedByMe={thread.conversation?.blockedByMe ?? false}
          busy={busy}
          clearOpen={clearOpen}
          blockOpen={blockOpen}
          reportOpen={reportOpen}
          onCloseClear={() => setClearOpen(false)}
          onCloseBlock={() => setBlockOpen(false)}
          onCloseReport={() => setReportOpen(false)}
          onConfirmClear={() => void handleClear()}
          onConfirmBlock={() => void handleBlock()}
          onBusy={setBusy}
        />
      </View>
    </ConnectAuthGate>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: SQUARE_PAGE_BG },
  card: { margin: 16, borderRadius: 12, backgroundColor: '#FFFFFF' },
  row: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: { fontSize: 15, color: APP_TEXT_COLOR },
  danger: { fontSize: 15, color: '#DC2626' },
});
