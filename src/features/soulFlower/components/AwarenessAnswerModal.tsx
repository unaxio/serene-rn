import { memo, useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

import { FullScreenModal } from '@/src/components/FullScreenModal';
import { QuestionForm } from '@/src/features/soulFlower/components/QuestionForm';
import type {
  FlowerCard,
  Question,
  SubmitAnswerResponse,
  TodayAnswer,
  TodayAnswerResult,
} from '@/src/features/soulFlower/types';
import { buildResultViewQuestion } from '@/src/features/soulFlower/utils/buildResultViewQuestion';

interface AwarenessAnswerModalProps {
  visible: boolean;
  question?: Question;
  todayAnswer?: TodayAnswer;
  flowerCard?: FlowerCard | null;
  initialResult?: TodayAnswerResult;
  onClose: () => void;
  onSubmit: (answerContent: string) => Promise<SubmitAnswerResponse | null>;
  onFinalize: () => Promise<void>;
  onCompleted?: () => void;
}

function AwarenessAnswerModalComponent({
  visible,
  question,
  todayAnswer,
  flowerCard,
  initialResult,
  onClose,
  onSubmit,
  onFinalize,
  onCompleted,
}: AwarenessAnswerModalProps) {
  const [frozenQuestion, setFrozenQuestion] = useState<Question | undefined>(question);
  const [frozenResult, setFrozenResult] = useState<TodayAnswerResult | undefined>(
    initialResult,
  );
  const [hasCompleted, setHasCompleted] = useState(false);
  const isResultView = Boolean(frozenResult);

  useEffect(() => {
    if (!visible) {
      return;
    }
    setHasCompleted(false);
    setFrozenResult(initialResult);
    setFrozenQuestion(
      question ??
        (todayAnswer ? buildResultViewQuestion(todayAnswer, flowerCard) : undefined),
    );
  }, [flowerCard, initialResult, question, todayAnswer, visible]);

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
    if (isResultView) {
      onClose();
      return;
    }

    const shouldShowTodayResult = hasCompleted;
    if (shouldShowTodayResult) {
      await onFinalize();
    }
    onClose();
    if (shouldShowTodayResult) {
      onCompleted?.();
    }
  }, [hasCompleted, isResultView, onClose, onCompleted, onFinalize]);

  return (
    <FullScreenModal
      visible={visible}
      title={isResultView ? '今日结果' : '今日觉察'}
      onBack={() => void dismiss()}>
      <KeyboardAwareScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled">
        {visible && frozenQuestion && (!isResultView || frozenResult) ? (
          <QuestionForm
            key={`${frozenQuestion.id}-${isResultView ? 'result' : 'answer'}`}
            question={frozenQuestion}
            initialResult={frozenResult}
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
