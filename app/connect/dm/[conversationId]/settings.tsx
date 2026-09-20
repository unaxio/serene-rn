import { useLocalSearchParams } from 'expo-router';

import { DmSettingsScreen } from '@/src/features/connect/components/DmSettingsScreen';

export default function DmSettingsRoute() {
  const { conversationId } = useLocalSearchParams<{ conversationId: string }>();
  const id = Array.isArray(conversationId) ? conversationId[0] : conversationId;
  return <DmSettingsScreen conversationId={id ?? ''} />;
}
