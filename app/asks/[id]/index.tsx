import { useLocalSearchParams } from 'expo-router';

import { AskDetailScreen } from '@/src/features/square/components/AskDetailScreen';

export default function AskDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const askId = Array.isArray(id) ? id[0] : id;
  return <AskDetailScreen askId={askId ?? ''} />;
}
