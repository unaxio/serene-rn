import { useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
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
  SHARE_CONTENT_MAX_LENGTH,
  SHARE_CONTENT_MIN_HEIGHT,
  SHARE_CONTENT_PLACEHOLDER,
  SHARE_DEFAULT_VISIBLE_RANGE,
  SHARE_PUBLISH_TITLE,
  SHARE_TOPIC_OPTIONAL_LABEL,
  SQUARE_PAGE_BG,
} from '@/src/features/square/constants';
import { useCreateShare } from '@/src/features/square/hooks/useCreateShare';
import type { ShareVisibleRange } from '@/src/features/square/types';

export function SharePublishScreen() {
  const router = useRouter();
  const { submit, isSubmitting } = useCreateShare();
  const [content, setContent] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [topicTag, setTopicTag] = useState<string | null>(null);
  const [visibleRange, setVisibleRange] = useState<ShareVisibleRange>(
    SHARE_DEFAULT_VISIBLE_RANGE,
  );
  const [isUploadingImages, setIsUploadingImages] = useState(false);

  const canSubmit = useMemo(
    () => (content.trim().length > 0 || images.length > 0) && !isUploadingImages,
    [content, images.length, isUploadingImages],
  );

  const handleSubmit = useCallback(async () => {
    if (!canSubmit || isSubmitting) {
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
  }, [canSubmit, content, images, isSubmitting, router, submit, topicTag, visibleRange]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <SquarePageHeader title={SHARE_PUBLISH_TITLE} onBack={() => router.back()} />
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
