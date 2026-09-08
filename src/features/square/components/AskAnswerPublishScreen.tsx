import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SquarePageHeader } from '@/src/features/square/components/SquarePageHeader';
import { AnonymousSwitchRow } from '@/src/features/square/components/publish/AnonymousSwitchRow';
import { CountedTextInput } from '@/src/features/square/components/publish/CountedTextInput';
import { PublishSubmitButton } from '@/src/features/square/components/publish/PublishSubmitButton';
import {
  ASK_ANSWER_MAX_LENGTH,
  ASK_ANSWER_MIN_HEIGHT,
  ASK_ANSWER_PUBLISH_TITLE,
  ASK_ANSWER_SUBMIT_LABEL,
  PUBLISH_CONFIRM_EDIT_LABEL,
  SQUARE_PAGE_BG,
} from '@/src/features/square/constants';
import { useAskAnswerDetail } from '@/src/features/square/hooks/useAskAnswerDetail';
import { useSaveAskAnswer } from '@/src/features/square/hooks/useSaveAskAnswer';
import { readRouteParam } from '@/src/features/square/utils/readRouteParam';

interface AskAnswerPublishScreenProps {
  askId: string;
}

export function AskAnswerPublishScreen({ askId }: AskAnswerPublishScreenProps) {
  const router = useRouter();
  const params = useLocalSearchParams<{ editId?: string | string[] }>();
  const editId = readRouteParam(params.editId);
  const { submit, isSubmitting, isEdit } = useSaveAskAnswer(askId, editId);
  const detail = useAskAnswerDetail(editId ?? '');
  const [content, setContent] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [prefilled, setPrefilled] = useState(false);

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
    <SafeAreaView style={styles.safe} edges={['top']}>
      <SquarePageHeader
        title={isEdit ? '编辑回答' : ASK_ANSWER_PUBLISH_TITLE}
        onBack={() => router.back()}
      />
      <KeyboardAwareScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled">
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
  submitWrap: {
    marginTop: 8,
  },
});
