import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { APP_TEXT_COLOR } from '@/src/features/soulFlower/constants';
import type { Question } from '@/src/features/soulFlower/types';

interface QuestionFormProps {
  question: Question;
  isSubmitting: boolean;
  onSubmit: (answerContent: string) => Promise<void> | Promise<boolean>;
}

const PLACEHOLDER_COLOR = '#9CA3AF';
const PRIMARY_COLOR = '#2F95DC';

export function QuestionForm({ question, isSubmitting, onSubmit }: QuestionFormProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [textAnswer, setTextAnswer] = useState('');

  const handleSubmit = useCallback(async () => {
    const answerContent =
      question.type === 'singleChoice' ? (selectedOption ?? '') : textAnswer;
    await onSubmit(answerContent);
  }, [onSubmit, question.type, selectedOption, textAnswer]);

  return (
    <View style={styles.container}>
      {question.flowerName ? (
        <Text style={styles.flowerName}>{question.flowerName}</Text>
      ) : null}
      {question.categoryName ? (
        <Text style={styles.categoryName}>{question.categoryName}</Text>
      ) : null}
      <Text style={styles.title}>{question.title}</Text>

      {question.type === 'singleChoice' ? (
        <View style={styles.options}>
          {(question.options ?? []).map((option) => {
            const isSelected = selectedOption === option;
            return (
              <Pressable
                key={option}
                style={[styles.option, isSelected && styles.optionSelected]}
                onPress={() => setSelectedOption(option)}
                disabled={isSubmitting}>
                <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                  {option}
                </Text>
              </Pressable>
            );
          })}
        </View>
      ) : (
        <TextInput
          style={styles.textInput}
          value={textAnswer}
          onChangeText={setTextAnswer}
          placeholder="写下你此刻的觉察..."
          placeholderTextColor={PLACEHOLDER_COLOR}
          multiline
          textAlignVertical="top"
          editable={!isSubmitting}
        />
      )}

      <Pressable
        style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
        onPress={handleSubmit}
        disabled={isSubmitting}>
        {isSubmitting ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.submitText}>提交觉察</Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  flowerName: {
    fontSize: 13,
    fontWeight: '600',
    color: PRIMARY_COLOR,
  },
  categoryName: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: -6,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: APP_TEXT_COLOR,
    lineHeight: 26,
  },
  options: {
    gap: 10,
    marginTop: 4,
  },
  option: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#FAFAFA',
  },
  optionSelected: {
    borderColor: PRIMARY_COLOR,
    backgroundColor: '#E8F4FC',
  },
  optionText: {
    fontSize: 15,
    color: '#374151',
  },
  optionTextSelected: {
    color: PRIMARY_COLOR,
    fontWeight: '600',
  },
  textInput: {
    minHeight: 120,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: APP_TEXT_COLOR,
    backgroundColor: '#FAFAFA',
  },
  submitButton: {
    marginTop: 8,
    height: 48,
    borderRadius: 12,
    backgroundColor: PRIMARY_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
