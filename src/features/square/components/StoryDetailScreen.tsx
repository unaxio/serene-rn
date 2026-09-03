import { useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { CommentSection } from '@/src/features/square/components/comments/CommentSection';
import { SendFlowerModal } from '@/src/features/square/components/SendFlowerModal';
import { StoryActionBar } from '@/src/features/square/components/StoryActionBar';
import { StoryDetailBody } from '@/src/features/square/components/StoryDetailBody';
import { StoryDetailHeader } from '@/src/features/square/components/StoryDetailHeader';
import {
  ACCENT_COLOR,
  COMING_SOON_MESSAGE,
  MUTED_TEXT_COLOR,
  SQUARE_PAGE_BG,
} from '@/src/features/square/constants';
import { useSquareAction } from '@/src/features/square/hooks/useSquareAction';
import { useStoryDetail } from '@/src/features/square/hooks/useStoryDetail';
import { showToast } from '@/src/utils/toast';

interface StoryDetailScreenProps {
  storyId: string;
}

export function StoryDetailScreen({ storyId }: StoryDetailScreenProps) {
  const router = useRouter();
  const { story, isLoading, isError, refetch } = useStoryDetail(storyId);
  const { runAction, isPending } = useSquareAction();
  const [commentVisible, setCommentVisible] = useState(false);
  const [flowerVisible, setFlowerVisible] = useState(false);
  const [commentCount, setCommentCount] = useState<number | null>(null);

  const displayCommentCount = commentCount ?? story?.commentCount ?? 0;

  const handleToggle = useCallback(
    (actionType: 'resonate' | 'collect') => {
      void runAction({ targetType: 'story', targetId: storyId, actionType });
    },
    [runAction, storyId],
  );

  const handleSendFlower = useCallback(
    async (quantity: number, message: string) => {
      const result = await runAction({
        targetType: 'story',
        targetId: storyId,
        actionType: 'flower',
        quantity,
        message: message || undefined,
      });
      return result !== null;
    },
    [runAction, storyId],
  );

  const body = useMemo(() => {
    if (isLoading) {
      return <ActivityIndicator style={styles.status} color={ACCENT_COLOR} />;
    }
    if (isError || !story) {
      return (
        <View style={styles.status}>
          <Text style={styles.error}>故事加载失败</Text>
          <Pressable onPress={() => void refetch()}>
            <Text style={styles.retry}>重试</Text>
          </Pressable>
        </View>
      );
    }
    return <StoryDetailBody story={story} />;
  }, [isError, isLoading, refetch, story]);

  return (
    <View style={styles.root}>
      <StoryDetailHeader onBack={() => router.back()} />
      <View style={styles.body}>{body}</View>
      {story ? (
        <StoryActionBar
          resonateCount={story.resonateCount}
          collectCount={story.collectCount}
          flowerCount={story.flowerCount}
          commentCount={displayCommentCount}
          isResonated={story.isResonated}
          isCollected={story.isCollected}
          onResonate={() => handleToggle('resonate')}
          onCollect={() => handleToggle('collect')}
          onFlower={() => setFlowerVisible(true)}
          onComment={() => setCommentVisible(true)}
          onShare={() => showToast(COMING_SOON_MESSAGE)}
        />
      ) : null}
      <CommentSection
        visible={commentVisible}
        onClose={() => setCommentVisible(false)}
        targetType="story"
        targetId={storyId}
        enableCollect
        onCommentCountChange={setCommentCount}
      />
      <SendFlowerModal
        visible={flowerVisible}
        isSubmitting={isPending}
        onClose={() => setFlowerVisible(false)}
        onSubmit={handleSendFlower}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: SQUARE_PAGE_BG,
  },
  body: {
    flex: 1,
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
