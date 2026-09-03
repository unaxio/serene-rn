import { useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SquarePageHeader } from '@/src/features/square/components/SquarePageHeader';
import { AnonymousSwitchRow } from '@/src/features/square/components/publish/AnonymousSwitchRow';
import { CountedTextInput } from '@/src/features/square/components/publish/CountedTextInput';
import { PublishSubmitButton } from '@/src/features/square/components/publish/PublishSubmitButton';
import { TopicTagPicker } from '@/src/features/square/components/publish/TopicTagPicker';
import {
  ASK_CONTENT_MAX_LENGTH,
  ASK_CONTENT_MIN_HEIGHT,
  ASK_PUBLISH_TITLE,
  ASK_TITLE_MAX_LENGTH,
  SQUARE_PAGE_BG,
} from '@/src/features/square/constants';
import { useCreateAsk } from '@/src/features/square/hooks/useCreateAsk';
import { showErrorToast } from '@/src/utils/toast';

export function AskPublishScreen() {
  const router = useRouter();
  const { submit, isSubmitting } = useCreateAsk();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [topicTag, setTopicTag] = useState<string | null>(null);
  const [isAnonymous, setIsAnonymous] = useState(false);

  const canSubmit = useMemo(
    () => title.trim().length > 0 && Boolean(topicTag),
    [title, topicTag],
  );

  const handleSubmit = useCallback(async () => {
    if (!canSubmit || !topicTag || isSubmitting) {
      return;
    }
    const ask = await submit({
      title: title.trim(),
      content: content.trim(),
      topicTag,
      isAnonymous,
    });
    if (!ask?.id) {
      if (ask) {
        showErrorToast('发布成功但未返回问答 ID');
      }
      return;
    }
    router.replace(`/asks/${ask.id}`);
  }, [canSubmit, content, isAnonymous, isSubmitting, router, submit, title, topicTag]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <SquarePageHeader title={ASK_PUBLISH_TITLE} onBack={() => router.back()} />
      <KeyboardAwareScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled">
        <CountedTextInput
          value={title}
          onChangeText={setTitle}
          placeholder="请输入问题（必填）"
          maxLength={ASK_TITLE_MAX_LENGTH}
        />
        <CountedTextInput
          value={content}
          onChangeText={setContent}
          placeholder="补充描述（选填）"
          maxLength={ASK_CONTENT_MAX_LENGTH}
          multiline
          minHeight={ASK_CONTENT_MIN_HEIGHT}
        />
        <TopicTagPicker selectedId={topicTag} onSelect={setTopicTag} />
        <AnonymousSwitchRow value={isAnonymous} onChange={setIsAnonymous} />
        <View style={styles.submitWrap}>
          <PublishSubmitButton
            enabled={canSubmit}
            isSubmitting={isSubmitting}
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
