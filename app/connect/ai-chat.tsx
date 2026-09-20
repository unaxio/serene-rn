import { useLocalSearchParams } from 'expo-router';

import { AiChatScreen } from '@/src/features/connect/components/AiChatScreen';

export default function AiChatRoute() {
  const { sessionId } = useLocalSearchParams<{ sessionId: string }>();
  const id = Array.isArray(sessionId) ? sessionId[0] : sessionId;
  return <AiChatScreen sessionId={id ?? ''} />;
}
