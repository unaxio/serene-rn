import { useLocalSearchParams } from 'expo-router';

import { FlowerCardDetailScreen } from '@/src/features/soulFlower/components/detail/FlowerCardDetailScreen';

export default function FlowerCardDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <FlowerCardDetailScreen flowerId={id ?? ''} />;
}
