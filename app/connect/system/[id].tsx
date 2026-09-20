import { useLocalSearchParams } from 'expo-router';

import { SystemMessageDetailScreen } from '@/src/features/connect/components/SystemMessageDetailScreen';

export default function SystemMessageRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const messageId = Array.isArray(id) ? id[0] : id;
  return <SystemMessageDetailScreen messageId={messageId ?? ''} />;
}
