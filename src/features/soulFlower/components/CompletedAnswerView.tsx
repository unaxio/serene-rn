import { StyleSheet, Text, View } from 'react-native';

import type { Question, TodayAnswer } from '@/src/features/soulFlower/types';

interface CompletedAnswerViewProps {
  question?: Question;
  todayAnswer?: TodayAnswer;
}

export function CompletedAnswerView({ question, todayAnswer }: CompletedAnswerViewProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.badge}>今日已完成觉察</Text>
      {question?.flowerName ? (
        <Text style={styles.flowerName}>{question.flowerName}</Text>
      ) : null}
      {question?.title ? <Text style={styles.questionTitle}>{question.title}</Text> : null}
      <View style={styles.answerBox}>
        <Text style={styles.answerLabel}>我的回答</Text>
        <Text style={styles.answerContent}>{todayAnswer?.answerContent ?? '—'}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  badge: {
    alignSelf: 'flex-start',
    fontSize: 13,
    fontWeight: '700',
    color: '#15803D',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    overflow: 'hidden',
  },
  flowerName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2F95DC',
  },
  questionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    lineHeight: 24,
  },
  answerBox: {
    marginTop: 4,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  answerLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 6,
  },
  answerContent: {
    fontSize: 15,
    color: '#1F2937',
    lineHeight: 22,
  },
});
