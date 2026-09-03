import { useLocalSearchParams } from 'expo-router';

import { StoryDetailScreen } from '@/src/features/square/components/StoryDetailScreen';

export default function StoryDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const storyId = Array.isArray(id) ? id[0] : id;
  return <StoryDetailScreen storyId={storyId ?? ''} />;
}
