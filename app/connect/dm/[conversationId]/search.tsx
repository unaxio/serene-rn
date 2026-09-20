import { useLocalSearchParams } from 'expo-router';

import { DmSearchScreen } from '@/src/features/connect/components/DmSearchScreen';

export default function DmSearchRoute() {
  const { conversationId } = useLocalSearchParams<{ conversationId: string }>();
  const id = Array.isArray(conversationId) ? conversationId[0] : conversationId;
  return <DmSearchScreen conversationId={id ?? ''} />;
}
