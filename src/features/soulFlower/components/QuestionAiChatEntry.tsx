import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { createAiSessionFromAnswer } from '@/src/features/connect/api';
import { AiRoleSelectModal } from '@/src/features/connect/components/AiRoleSelectModal';
import { rememberAiRole, setAiSessionDraft } from '@/src/features/connect/utils/aiSessionDraft';
import { AI_ACCENT_COLOR } from '@/src/features/soulFlower/constants';
import { useRequireAuth } from '@/src/features/square/hooks/useRequireAuth';
import { toastCaughtFailure } from '@/src/utils/requestError';
import { showToast } from '@/src/utils/toast';

interface QuestionAiChatEntryProps {
  answerId: string | null;
  onOpened?: () => void | Promise<void>;
}

const MISSING_ANSWER_MESSAGE = '缺少答题记录，暂时无法发起对话';

export function QuestionAiChatEntry({ answerId, onOpened }: QuestionAiChatEntryProps) {
  const router = useRouter();
  const requireAuth = useRequireAuth();
  const [visible, setVisible] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const openPicker = useCallback(() => {
    if (!requireAuth()) {
      return;
    }
    if (!answerId) {
      showToast(MISSING_ANSWER_MESSAGE);
      return;
    }
    setVisible(true);
  }, [answerId, requireAuth]);

  const handleConfirm = useCallback(
    async (roleId: string) => {
      if (!answerId || confirming) {
        return;
      }
      setConfirming(true);
      try {
        const session = await createAiSessionFromAnswer(answerId, roleId);
        rememberAiRole(roleId);
        setAiSessionDraft(session);
        setVisible(false);
        router.push({ pathname: '/connect/ai-chat', params: { sessionId: session.sessionId } });
        await onOpened?.();
      } catch (error) {
        toastCaughtFailure(error);
      } finally {
        setConfirming(false);
      }
    },
    [answerId, confirming, onOpened, router],
  );

  return (
    <>
      <Pressable onPress={openPicker} disabled={confirming}>
        <Text style={styles.link}>AI一对一聊→</Text>
      </Pressable>
      <AiRoleSelectModal
        visible={visible}
        confirming={confirming}
        onClose={() => setVisible(false)}
        onConfirm={(roleId) => void handleConfirm(roleId)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  link: {
    fontSize: 13,
    color: AI_ACCENT_COLOR,
    textDecorationLine: 'underline',
  },
});
