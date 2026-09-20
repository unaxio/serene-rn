import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { View } from 'react-native';

import { createAiSession } from '@/src/features/connect/api';
import { AiRolePicker } from '@/src/features/connect/components/AiRolePicker';
import { ConnectAuthGate } from '@/src/features/connect/components/ConnectAuthGate';
import { rememberAiRole, setAiSessionDraft } from '@/src/features/connect/utils/aiSessionDraft';
import { SquarePageHeader } from '@/src/features/square/components/SquarePageHeader';
import { toastCaughtFailure } from '@/src/utils/requestError';

export function AiRoleSelectScreen() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const handleConfirm = useCallback(
    async (roleId: string) => {
      if (submitting) {
        return;
      }
      setSubmitting(true);
      try {
        const session = await createAiSession(roleId);
        rememberAiRole(roleId);
        setAiSessionDraft(session);
        router.push({ pathname: '/connect/ai-chat', params: { sessionId: session.sessionId } });
      } catch (error) {
        toastCaughtFailure(error);
      } finally {
        setSubmitting(false);
      }
    },
    [router, submitting],
  );

  return (
    <ConnectAuthGate>
      <View style={{ flex: 1 }}>
        <SquarePageHeader title="选择角色" onBack={() => router.back()} />
        <AiRolePicker confirming={submitting} onConfirm={(roleId) => void handleConfirm(roleId)} />
      </View>
    </ConnectAuthGate>
  );
}
