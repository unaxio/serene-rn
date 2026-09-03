import { useLocalSearchParams } from 'expo-router';

import { AskAnswerPublishScreen } from '@/src/features/square/components/AskAnswerPublishScreen';

export default function AskAnswerRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const askId = Array.isArray(id) ? id[0] : id;
  return <AskAnswerPublishScreen askId={askId ?? ''} />;
}
