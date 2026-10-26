import { useLocalSearchParams } from 'expo-router';

import { TopicPostsScreen } from '@/src/features/square/components/TopicPostsScreen';

export default function TopicPostsRoute() {
  const { name } = useLocalSearchParams<{ name?: string }>();
  const topicName = Array.isArray(name) ? name[0] : name;
  return <TopicPostsScreen name={topicName ?? ''} />;
}
