import { useLocalSearchParams } from 'expo-router';

import { DmChatScreen } from '@/src/features/connect/components/DmChatScreen';

export default function DmChatRoute() {
  const params = useLocalSearchParams<{ conversationId: string; focusMessageId?: string }>();
  const conversationId = Array.isArray(params.conversationId)
    ? params.conversationId[0]
    : params.conversationId;
  const focusMessageId = Array.isArray(params.focusMessageId)
    ? params.focusMessageId[0]
    : params.focusMessageId;
  return <DmChatScreen conversationId={conversationId ?? ''} focusMessageId={focusMessageId} />;
}
