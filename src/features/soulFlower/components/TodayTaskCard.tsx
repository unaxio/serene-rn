import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { CompletedAnswerView } from '@/src/features/soulFlower/components/CompletedAnswerView';
import { QuestionForm } from '@/src/features/soulFlower/components/QuestionForm';
import { APP_TEXT_COLOR } from '@/src/features/soulFlower/constants';
import { useTodayTask } from '@/src/features/soulFlower/hooks/useTodayTask';

export function TodayTaskCard() {
  const {
    data,
    isLoading,
    isError,
    refetch,
    isSubmitting,
    submitAnswer,
  } = useTodayTask();

  if (isLoading) {
    return (
      <View style={styles.card}>
        <ActivityIndicator color="#2F95DC" />
        <Text style={styles.hint}>正在加载今日觉察...</Text>
      </View>
    );
  }

  if (isError || !data) {
    return (
      <View style={styles.card}>
        <Text style={styles.errorTitle}>加载失败</Text>
        <Text style={styles.hint}>请检查网络后重试</Text>
        <Pressable style={styles.retryButton} onPress={() => void refetch()}>
          <Text style={styles.retryText}>重新加载</Text>
        </Pressable>
      </View>
    );
  }

  if (data.alreadyAnswered) {
    return (
      <View style={styles.card}>
        <CompletedAnswerView question={data.question} todayAnswer={data.todayAnswer} />
      </View>
    );
  }

  if (!data.hasTask || !data.question) {
    return (
      <View style={styles.card}>
        <Text style={styles.emptyTitle}>今日暂无觉察任务</Text>
        <Text style={styles.hint}>稍后再来看看吧</Text>
      </View>
    );
  }

  const question = data.question;

  return (
    <View style={styles.card}>
      <Text style={styles.header}>开始今日觉察</Text>
      <QuestionForm
        question={question}
        isSubmitting={isSubmitting}
        onSubmit={(answerContent) => submitAnswer(question.id, answerContent)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 12,
  },
  header: {
    fontSize: 20,
    fontWeight: '700',
    color: APP_TEXT_COLOR,
    marginBottom: 4,
  },
  hint: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#B91C1C',
    textAlign: 'center',
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
  },
  retryButton: {
    alignSelf: 'center',
    marginTop: 4,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#2F95DC',
  },
  retryText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
