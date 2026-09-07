import { useLocalSearchParams } from 'expo-router';

import { AskAnswerDetailScreen } from '@/src/features/square/components/AskAnswerDetailScreen';

export default function AskAnswerDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const answerId = Array.isArray(id) ? id[0] : id;
  return <AskAnswerDetailScreen answerId={answerId ?? ''} />;
}
