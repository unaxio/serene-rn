import { isAxiosError } from 'axios';
import { Image } from 'expo-image';
import { useCallback, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import {
  ACCENT_COLOR,
  MUTED_TEXT_COLOR,
  PLACEHOLDER_TEXT_COLOR,
  SEARCH_BAR_BG,
  SHARE_IMAGE_MAX_COUNT,
  SHARE_IMAGE_RADIUS,
  SHARE_IMAGE_UPLOAD_LABEL,
  SHARE_UPLOAD_GRID_GAP,
  SHARE_UPLOAD_THUMB_SIZE,
} from '@/src/features/square/constants';
import { uploadSquareImage } from '@/src/features/square/api';
import { pickSquareImages } from '@/src/features/square/utils/pickSquareImage';
import { resolveCdnUrl } from '@/src/utils/cdn';
import { showErrorToast } from '@/src/utils/toast';

interface ShareImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  onUploadingChange?: (isUploading: boolean) => void;
}

const REMOVE_HIT_SLOP = 8;

export function ShareImageUploader({
  images,
  onChange,
  onUploadingChange,
}: ShareImageUploaderProps) {
  const imagesRef = useRef(images);
  imagesRef.current = images;
  const [isUploading, setIsUploading] = useState(false);
  const remaining = SHARE_IMAGE_MAX_COUNT - images.length;

  const handlePick = useCallback(async () => {
    if (isUploading || remaining <= 0) {
      return;
    }
    const files = await pickSquareImages(remaining);
    if (files.length === 0) {
      return;
    }
    setIsUploading(true);
    onUploadingChange?.(true);
    let next = imagesRef.current;
    try {
      for (const file of files) {
        const uploaded = await uploadSquareImage(file);
        next = [...next, uploaded.relativePath];
        onChange(next);
      }
    } catch (error) {
      if (!isAxiosError(error)) {
        showErrorToast('图片上传失败，请重试');
      }
    } finally {
      setIsUploading(false);
      onUploadingChange?.(false);
    }
  }, [isUploading, onChange, onUploadingChange, remaining]);

  const handleRemove = useCallback(
    (index: number) => {
      onChange(images.filter((_, itemIndex) => itemIndex !== index));
    },
    [images, onChange],
  );

  return (
    <View style={styles.grid}>
      {images.map((path, index) => {
        const uri = resolveCdnUrl(path);
        return (
          <View key={`${path}-${index}`} style={styles.thumbWrap}>
            {uri ? (
              <Image source={{ uri }} style={styles.thumb} contentFit="cover" />
            ) : (
              <View style={[styles.thumb, styles.thumbFallback]} />
            )}
            <Pressable
              style={styles.remove}
              hitSlop={REMOVE_HIT_SLOP}
              onPress={() => handleRemove(index)}>
              <Text style={styles.removeText}>×</Text>
            </Pressable>
          </View>
        );
      })}
      {remaining > 0 ? (
        <Pressable style={styles.add} onPress={() => void handlePick()}>
          {isUploading ? (
            <ActivityIndicator color={ACCENT_COLOR} />
          ) : (
            <Text style={styles.addText}>{SHARE_IMAGE_UPLOAD_LABEL}</Text>
          )}
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SHARE_UPLOAD_GRID_GAP,
  },
  thumbWrap: {
    width: SHARE_UPLOAD_THUMB_SIZE,
    height: SHARE_UPLOAD_THUMB_SIZE,
  },
  thumb: {
    width: SHARE_UPLOAD_THUMB_SIZE,
    height: SHARE_UPLOAD_THUMB_SIZE,
    borderRadius: SHARE_IMAGE_RADIUS,
    backgroundColor: SEARCH_BAR_BG,
  },
  thumbFallback: {
    backgroundColor: '#E2E8F0',
  },
  remove: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(15, 23, 42, 0.72)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeText: {
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 16,
    fontWeight: '700',
  },
  add: {
    width: SHARE_UPLOAD_THUMB_SIZE,
    height: SHARE_UPLOAD_THUMB_SIZE,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: PLACEHOLDER_TEXT_COLOR,
    borderRadius: SHARE_IMAGE_RADIUS,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  addText: {
    fontSize: 12,
    color: MUTED_TEXT_COLOR,
    textAlign: 'center',
  },
});
