import { useRouter } from 'expo-router';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { StoryDetailHeader } from '@/src/features/square/components/StoryDetailHeader';
import { StoryDetailLoaded } from '@/src/features/square/components/StoryDetailLoaded';
import {
  ACCENT_COLOR,
  MUTED_TEXT_COLOR,
  SQUARE_PAGE_BG,
} from '@/src/features/square/constants';
import { useStoryDetail } from '@/src/features/square/hooks/useStoryDetail';

interface StoryDetailScreenProps {
  storyId: string;
}

export function StoryDetailScreen({ storyId }: StoryDetailScreenProps) {
  const router = useRouter();
  const { story, isLoading, isError, refetch } = useStoryDetail(storyId);

  return (
    <View style={styles.root}>
      <StoryDetailHeader onBack={() => router.back()} />
      {isLoading ? (
        <ActivityIndicator style={styles.status} color={ACCENT_COLOR} />
      ) : null}
      {isError || (!isLoading && !story) ? (
        <View style={styles.status}>
          <Text style={styles.error}>故事加载失败</Text>
          <Pressable onPress={() => void refetch()}>
            <Text style={styles.retry}>重试</Text>
          </Pressable>
        </View>
      ) : null}
      {story ? <StoryDetailLoaded storyId={storyId} story={story} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: SQUARE_PAGE_BG,
  },
  status: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  error: {
    fontSize: 14,
    color: MUTED_TEXT_COLOR,
  },
  retry: {
    fontSize: 14,
    fontWeight: '600',
    color: ACCENT_COLOR,
  },
});
