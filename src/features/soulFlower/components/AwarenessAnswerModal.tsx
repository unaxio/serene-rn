import { memo, useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

import { FullScreenModal } from '@/src/components/FullScreenModal';
import { QuestionForm } from '@/src/features/soulFlower/components/QuestionForm';
import type { Question, SubmitAnswerResponse } from '@/src/features/soulFlower/types';

interface AwarenessAnswerModalProps {
  visible: boolean;
  question?: Question;
  onClose: () => void;
  onSubmit: (answerContent: string) => Promise<SubmitAnswerResponse | null>;
  onFinalize: () => Promise<void>;
  onCompleted?: () => void;
}

function AwarenessAnswerModalComponent({
  visible,
  question,
  onClose,
  onSubmit,
  onFinalize,
  onCompleted,
}: AwarenessAnswerModalProps) {
  const [frozenQuestion, setFrozenQuestion] = useState<Question | undefined>(question);
  const [hasCompleted, setHasCompleted] = useState(false);

  useEffect(() => {
    if (!visible) {
      return;
    }
    setHasCompleted(false);
    if (question) {
      setFrozenQuestion(question);
    }
  }, [question, visible]);

  const handleSubmit = useCallback(
    async (answerContent: string) => {
      const result = await onSubmit(answerContent);
      if (result && result.success !== false) {
        setHasCompleted(true);
      }
      return result;
    },
    [onSubmit],
  );

  const dismiss = useCallback(async () => {
    const shouldShowTodayResult = hasCompleted;
    if (shouldShowTodayResult) {
      await onFinalize();
    }
    onClose();
    if (shouldShowTodayResult) {
      onCompleted?.();
    }
  }, [hasCompleted, onClose, onCompleted, onFinalize]);

  return (
    <FullScreenModal visible={visible} title="今日觉察" onBack={() => void dismiss()}>
      <KeyboardAwareScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled">
        {visible && frozenQuestion ? (
            <QuestionForm
              key={frozenQuestion.id}
              question={frozenQuestion}
              onSubmit={handleSubmit}
            />
        ) : (
          <Text style={styles.empty}>暂无可用题目</Text>
        )}
      </KeyboardAwareScrollView>
    </FullScreenModal>
  );
}

export const AwarenessAnswerModal = memo(AwarenessAnswerModalComponent);

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
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
