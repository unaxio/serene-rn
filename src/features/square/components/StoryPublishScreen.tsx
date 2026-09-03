import { useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SquarePageHeader } from '@/src/features/square/components/SquarePageHeader';
import { AnonymousSwitchRow } from '@/src/features/square/components/publish/AnonymousSwitchRow';
import { CountedTextInput } from '@/src/features/square/components/publish/CountedTextInput';
import { CoverImageUploader } from '@/src/features/square/components/publish/CoverImageUploader';
import { PublishSubmitButton } from '@/src/features/square/components/publish/PublishSubmitButton';
import { TopicTagPicker } from '@/src/features/square/components/publish/TopicTagPicker';
import {
  SQUARE_PAGE_BG,
  STORY_CONTENT_MAX_LENGTH,
  STORY_TITLE_MAX_LENGTH,
} from '@/src/features/square/constants';
import { useCreateStory } from '@/src/features/square/hooks/useCreateStory';
import { showErrorToast } from '@/src/utils/toast';

const CONTENT_MIN_HEIGHT = 160;

export function StoryPublishScreen() {
  const router = useRouter();
  const { submit, isSubmitting } = useCreateStory();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [topicTag, setTopicTag] = useState<string | null>(null);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [isAnonymous, setIsAnonymous] = useState(false);

  const canSubmit = useMemo(
    () => title.trim().length > 0 && content.trim().length > 0 && Boolean(topicTag),
    [content, title, topicTag],
  );

  const handleSubmit = useCallback(async () => {
    if (!canSubmit || !topicTag || isSubmitting) {
      return;
    }
    const story = await submit({
      title: title.trim(),
      content: content.trim(),
      topicTag,
      coverImage: coverImage ?? undefined,
      isAnonymous,
      isDraft: false,
    });
    if (!story?.id) {
      if (story) {
        showErrorToast('发布成功但未返回故事 ID');
      }
      return;
    }
    router.replace(`/stories/${story.id}`);
  }, [canSubmit, content, coverImage, isAnonymous, isSubmitting, router, submit, title, topicTag]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <SquarePageHeader title="投稿" onBack={() => router.back()} />
      <KeyboardAwareScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled">
        <CountedTextInput
          value={title}
          onChangeText={setTitle}
          placeholder="请输入标题（必填）"
          maxLength={STORY_TITLE_MAX_LENGTH}
        />
        <CountedTextInput
          value={content}
          onChangeText={setContent}
          placeholder="补充描述（必填）"
          maxLength={STORY_CONTENT_MAX_LENGTH}
          multiline
          minHeight={CONTENT_MIN_HEIGHT}
        />
        <TopicTagPicker selectedId={topicTag} onSelect={setTopicTag} />
        <CoverImageUploader relativePath={coverImage} onChange={setCoverImage} />
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
