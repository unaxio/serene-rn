import { useRouter } from 'expo-router';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { AskAnswerDetailLoaded } from '@/src/features/square/components/AskAnswerDetailLoaded';
import { StoryDetailHeader } from '@/src/features/square/components/StoryDetailHeader';
import {
  ACCENT_COLOR,
  ASK_ANSWER_DETAIL_ERROR,
  MUTED_TEXT_COLOR,
  PAGE_SURFACE_COLOR,
} from '@/src/features/square/constants';
import { useAskAnswerDetail } from '@/src/features/square/hooks/useAskAnswerDetail';

interface AskAnswerDetailScreenProps {
  answerId: string;
}

export function AskAnswerDetailScreen({ answerId }: AskAnswerDetailScreenProps) {
  const router = useRouter();
  const { detail, isLoading, isError, refetch } = useAskAnswerDetail(answerId);

  return (
    <View style={styles.root}>
      <StoryDetailHeader
        onBack={() => router.back()}
        targetId={answerId}
        authorId={detail?.author.id}
        contentKind="ask_answer"
        askId={detail?.askId ?? detail?.ask.id}
        onDeleted={() => router.back()}
      />
      {isLoading ? <ActivityIndicator style={styles.status} color={ACCENT_COLOR} /> : null}
      {isError || (!isLoading && !detail) ? (
        <View style={styles.status}>
          <Text style={styles.error}>{ASK_ANSWER_DETAIL_ERROR}</Text>
          <Pressable onPress={() => void refetch()}>
            <Text style={styles.retry}>重试</Text>
          </Pressable>
        </View>
      ) : null}
      {detail ? <AskAnswerDetailLoaded detail={detail} /> : null}
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
