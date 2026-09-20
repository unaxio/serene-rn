import { useLocalSearchParams } from 'expo-router';

import { ShareDetailScreen } from '@/src/features/square/components/ShareDetailScreen';

export default function ShareDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const shareId = Array.isArray(id) ? id[0] : id;
  return <ShareDetailScreen shareId={shareId ?? ''} />;
}
