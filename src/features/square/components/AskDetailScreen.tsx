import { useRouter } from 'expo-router';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { AskDetailLoaded } from '@/src/features/square/components/AskDetailLoaded';
import { StoryDetailHeader } from '@/src/features/square/components/StoryDetailHeader';
import {
  ACCENT_COLOR,
  MUTED_TEXT_COLOR,
  PAGE_SURFACE_COLOR,
} from '@/src/features/square/constants';
import { useAskDetail } from '@/src/features/square/hooks/useAskDetail';

interface AskDetailScreenProps {
  askId: string;
}

export function AskDetailScreen({ askId }: AskDetailScreenProps) {
  const router = useRouter();
  const { ask, isLoading, isError, refetch } = useAskDetail(askId);

  return (
    <View style={styles.root}>
      <StoryDetailHeader
        onBack={() => router.back()}
        targetId={askId}
        authorId={ask?.author.id}
        contentKind="ask"
        onDeleted={() => router.back()}
      />
      {isLoading ? <ActivityIndicator style={styles.status} color={ACCENT_COLOR} /> : null}
      {isError || (!isLoading && !ask) ? (
        <View style={styles.status}>
          <Text style={styles.error}>问答加载失败</Text>
          <Pressable onPress={() => void refetch()}>
            <Text style={styles.retry}>重试</Text>
          </Pressable>
        </View>
      ) : null}
      {ask ? <AskDetailLoaded askId={askId} ask={ask} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: PAGE_SURFACE_COLOR,
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
