import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { SafeAreaView } from 'react-native-safe-area-context';

import { APP_TEXT_COLOR } from '@/constants/Colors';
import { SquarePageHeader } from '@/src/features/square/components/SquarePageHeader';
import { AnonymousSwitchRow } from '@/src/features/square/components/publish/AnonymousSwitchRow';
import { CountedTextInput } from '@/src/features/square/components/publish/CountedTextInput';
import { PublishSubmitButton } from '@/src/features/square/components/publish/PublishSubmitButton';
import {
  ASK_ANSWER_MAX_LENGTH,
  ASK_ANSWER_MIN_HEIGHT,
  ASK_ANSWER_PUBLISH_TITLE,
  ASK_ANSWER_SUBMIT_LABEL,
  CARD_BORDER_COLOR,
  PUBLISH_CONFIRM_EDIT_LABEL,
  SQUARE_PAGE_BG,
} from '@/src/features/square/constants';
import { useAskAnswerDetail } from '@/src/features/square/hooks/useAskAnswerDetail';
import { useAskDetail } from '@/src/features/square/hooks/useAskDetail';
import { useSaveAskAnswer } from '@/src/features/square/hooks/useSaveAskAnswer';
import { readRouteParam } from '@/src/features/square/utils/readRouteParam';

interface AskAnswerPublishScreenProps {
  askId: string;
}

const QUESTION_TITLE_SIZE = 17;
const QUESTION_TITLE_LINE_HEIGHT = 24;
const DIVIDER_HEIGHT = StyleSheet.hairlineWidth;

export function AskAnswerPublishScreen({ askId }: AskAnswerPublishScreenProps) {
  const router = useRouter();
  const params = useLocalSearchParams<{ editId?: string | string[] }>();
  const editId = readRouteParam(params.editId);
  const { submit, isSubmitting, isEdit } = useSaveAskAnswer(askId, editId);
  const detail = useAskAnswerDetail(editId ?? '');
  const askDetail = useAskDetail(askId);
  const [content, setContent] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [prefilled, setPrefilled] = useState(false);
  const questionTitle = askDetail.ask?.title?.trim() || detail.detail?.ask.title?.trim() || '';

  useEffect(() => {
    if (!isEdit || prefilled || !detail.detail) {
      return;
    }
    setContent(detail.detail.content);
    setPrefilled(true);
  }, [detail.detail, isEdit, prefilled]);

  const canSubmit = useMemo(
    () => content.trim().length > 0 && (!isEdit || prefilled),
    [content, isEdit, prefilled],
  );

  const handleSubmit = useCallback(async () => {
    if (!canSubmit || isSubmitting || !askId) {
      return;
    }
    const answer = await submit({
      content: content.trim(),
      isAnonymous,
    });
    if (!answer) {
      return;
    }
    router.back();
  }, [askId, canSubmit, content, isAnonymous, isSubmitting, router, submit]);

  return (
    <SafeAreaView style={styles.safe} edges={[]}>
      <SquarePageHeader
        title={isEdit ? '编辑回答' : ASK_ANSWER_PUBLISH_TITLE}
        onBack={() => router.back()}
      />
      <KeyboardAwareScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled">
        {questionTitle.length > 0 ? (
          <View style={styles.questionBlock}>
            <Text style={styles.questionTitle}>{questionTitle}</Text>
            <View style={styles.divider} />
          </View>
        ) : null}
        <CountedTextInput
          value={content}
          onChangeText={setContent}
          placeholder="写下你的回答"
          maxLength={ASK_ANSWER_MAX_LENGTH}
          multiline
          minHeight={ASK_ANSWER_MIN_HEIGHT}
        />
        <AnonymousSwitchRow value={isAnonymous} onChange={setIsAnonymous} />
        <View style={styles.submitWrap}>
          <PublishSubmitButton
            enabled={canSubmit}
            isSubmitting={isSubmitting}
            label={isEdit ? PUBLISH_CONFIRM_EDIT_LABEL : ASK_ANSWER_SUBMIT_LABEL}
            onPress={() => {
              void handleSubmit();
            }}
          />
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: SQUARE_PAGE_BG,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 40,
    gap: 20,
  },
  questionBlock: {
    gap: 16,
  },
  questionTitle: {
    fontSize: QUESTION_TITLE_SIZE,
    fontWeight: '700',
    lineHeight: QUESTION_TITLE_LINE_HEIGHT,
    color: APP_TEXT_COLOR,
  },
  divider: {
    height: DIVIDER_HEIGHT,
    backgroundColor: CARD_BORDER_COLOR,
  },
  submitWrap: {
    marginTop: 8,
  },
});
