import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SquarePageHeader } from '@/src/features/square/components/SquarePageHeader';
import { CountedTextInput } from '@/src/features/square/components/publish/CountedTextInput';
import { PublishSubmitButton } from '@/src/features/square/components/publish/PublishSubmitButton';
import { ShareImageUploader } from '@/src/features/square/components/publish/ShareImageUploader';
import { TopicTagPicker } from '@/src/features/square/components/publish/TopicTagPicker';
import { VisibleRangePicker } from '@/src/features/square/components/publish/VisibleRangePicker';
import {
  PUBLISH_CONFIRM_EDIT_LABEL,
  SHARE_CONTENT_MAX_LENGTH,
  SHARE_CONTENT_MIN_HEIGHT,
  SHARE_CONTENT_PLACEHOLDER,
  SHARE_DEFAULT_VISIBLE_RANGE,
  SHARE_PUBLISH_TITLE,
  SHARE_TOPIC_OPTIONAL_LABEL,
  SQUARE_PAGE_BG,
} from '@/src/features/square/constants';
import { useSaveShare } from '@/src/features/square/hooks/useSaveShare';
import { useShareDetail } from '@/src/features/square/hooks/useShareDetail';
import type { ShareVisibleRange } from '@/src/features/square/types';
import { readRouteParam } from '@/src/features/square/utils/readRouteParam';

export function SharePublishScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ editId?: string | string[] }>();
  const editId = readRouteParam(params.editId);
  const { submit, isSubmitting, isEdit } = useSaveShare(editId);
  const detail = useShareDetail(editId ?? '');
  const [content, setContent] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [topicTag, setTopicTag] = useState<string | null>(null);
  const [visibleRange, setVisibleRange] = useState<ShareVisibleRange>(
    SHARE_DEFAULT_VISIBLE_RANGE,
  );
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [prefilled, setPrefilled] = useState(false);

  useEffect(() => {
    if (!isEdit || prefilled || !detail.share) {
      return;
    }
    setContent(detail.share.content);
    setImages(detail.share.images);
    setTopicTag(detail.share.topicTag);
    setVisibleRange(detail.share.visibleRange);
    setPrefilled(true);
  }, [detail.share, isEdit, prefilled]);

  const canSubmit = useMemo(
    () =>
      (content.trim().length > 0 || images.length > 0) &&
      !isUploadingImages &&
      (!isEdit || prefilled),
    [content, images.length, isEdit, isUploadingImages, prefilled],
  );

  const handleSubmit = useCallback(async () => {
    if (!canSubmit || isSubmitting || isUploadingImages) {
      return;
    }
    const share = await submit({
      content: content.trim(),
      images,
      visibleRange,
      topicTag: topicTag ?? undefined,
    });
    if (!share?.id) {
      return;
    }
    router.back();
  }, [
    canSubmit,
    content,
    images,
    isSubmitting,
    isUploadingImages,
    router,
    submit,
    topicTag,
    visibleRange,
  ]);

  return (
    <SafeAreaView style={styles.safe} edges={[]}>
      <SquarePageHeader
        title={isEdit ? '编辑分享' : SHARE_PUBLISH_TITLE}
        onBack={() => router.back()}
      />
      <KeyboardAwareScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled">
        <CountedTextInput
          value={content}
          onChangeText={setContent}
          placeholder={SHARE_CONTENT_PLACEHOLDER}
          maxLength={SHARE_CONTENT_MAX_LENGTH}
          multiline
          minHeight={SHARE_CONTENT_MIN_HEIGHT}
        />
        <ShareImageUploader
          images={images}
          onChange={setImages}
          onUploadingChange={setIsUploadingImages}
        />
        <TopicTagPicker
          selectedId={topicTag}
          onSelect={setTopicTag}
          allowDeselect
          label={SHARE_TOPIC_OPTIONAL_LABEL}
        />
        <VisibleRangePicker value={visibleRange} onChange={setVisibleRange} />
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
