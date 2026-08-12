import { memo, useCallback } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

import { QuestionForm } from '@/src/features/soulFlower/components/QuestionForm';
import { APP_TEXT_COLOR } from '@/src/features/soulFlower/constants';
import type { Question } from '@/src/features/soulFlower/types';

interface AwarenessAnswerModalProps {
  visible: boolean;
  question?: Question;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (answerContent: string) => Promise<boolean>;
}

function AwarenessAnswerModalComponent({
  visible,
  question,
  isSubmitting,
  onClose,
  onSubmit,
}: AwarenessAnswerModalProps) {
  const handleSubmit = useCallback(
    async (answerContent: string) => {
      const success = await onSubmit(answerContent);
      if (success) {
        onClose();
      }
    },
    [onClose, onSubmit],
  );

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>开始今日觉察</Text>
          <Pressable onPress={onClose} hitSlop={12}>
            <Text style={styles.close}>关闭</Text>
          </Pressable>
        </View>
        <KeyboardAwareScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled">
          {question ? (
            <QuestionForm
              question={question}
              isSubmitting={isSubmitting}
              onSubmit={handleSubmit}
            />
          ) : (
            <Text style={styles.empty}>暂无可用题目</Text>
          )}
        </KeyboardAwareScrollView>
      </View>
    </Modal>
  );
}

export const AwarenessAnswerModal = memo(AwarenessAnswerModalComponent);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E2E8F0',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: APP_TEXT_COLOR,
  },
  close: {
    fontSize: 15,
    color: '#64748B',
  },
  content: {
    padding: 20,
  },
  empty: {
    textAlign: 'center',
    color: '#94A3B8',
    marginTop: 40,
  },
});
