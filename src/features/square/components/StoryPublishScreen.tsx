import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
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
  PUBLISH_CONFIRM_EDIT_LABEL,
  SQUARE_PAGE_BG,
  STORY_CONTENT_MAX_LENGTH,
  STORY_TITLE_MAX_LENGTH,
} from '@/src/features/square/constants';
import { useSaveStory } from '@/src/features/square/hooks/useSaveStory';
import { useStoryDetail } from '@/src/features/square/hooks/useStoryDetail';
import { readRouteParam } from '@/src/features/square/utils/readRouteParam';
import { showErrorToast } from '@/src/utils/toast';

const CONTENT_MIN_HEIGHT = 160;

export function StoryPublishScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ editId?: string | string[] }>();
  const editId = readRouteParam(params.editId);
  const { submit, isSubmitting, isEdit } = useSaveStory(editId);
  const detail = useStoryDetail(editId ?? '');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [topicTag, setTopicTag] = useState<string | null>(null);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [prefilled, setPrefilled] = useState(false);

  useEffect(() => {
    if (!isEdit || prefilled || !detail.story) {
      return;
    }
    setTitle(detail.story.title);
    setContent(detail.story.content);
    setTopicTag(detail.story.topicTag);
    setCoverImage(detail.story.coverImagePath);
    setPrefilled(true);
  }, [detail.story, isEdit, prefilled]);

  const canSubmit = useMemo(
    () =>
      title.trim().length > 0 &&
      content.trim().length > 0 &&
      Boolean(topicTag) &&
      !isUploadingCover &&
      (!isEdit || prefilled),
    [content, isEdit, isUploadingCover, prefilled, title, topicTag],
  );

  const handleSubmit = useCallback(async () => {
    if (!canSubmit || !topicTag || isSubmitting || isUploadingCover) {
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
        showErrorToast('保存成功但未返回故事 ID');
      }
      return;
    }
    if (isEdit) {
      router.back();
      return;
    }
    router.replace(`/stories/${story.id}`);
  }, [
    canSubmit,
    content,
    coverImage,
    isAnonymous,
    isEdit,
    isSubmitting,
    isUploadingCover,
    router,
    submit,
    title,
    topicTag,
  ]);

  return (
    <SafeAreaView style={styles.safe} edges={[]}>
      <SquarePageHeader title={isEdit ? '编辑故事' : '投稿'} onBack={() => router.back()} />
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
        <CoverImageUploader
          relativePath={coverImage}
          onChange={setCoverImage}
          onUploadingChange={setIsUploadingCover}
        />
        <AnonymousSwitchRow value={isAnonymous} onChange={setIsAnonymous} />
        <View style={styles.submitWrap}>
          <PublishSubmitButton
            enabled={canSubmit}
            isSubmitting={isSubmitting}
            label={isEdit ? PUBLISH_CONFIRM_EDIT_LABEL : undefined}
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
