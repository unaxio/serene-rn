import { isAxiosError } from 'axios';
import { Image } from 'expo-image';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import {
  ACCENT_COLOR,
  MUTED_TEXT_COLOR,
  PLACEHOLDER_TEXT_COLOR,
} from '@/src/features/square/constants';
import { uploadSquareImage } from '@/src/features/square/api';
import { pickSquareImage } from '@/src/features/square/utils/pickSquareImage';
import { resolveCdnUrl } from '@/src/utils/cdn';
import { showErrorToast } from '@/src/utils/toast';

interface CoverImageUploaderProps {
  relativePath: string | null;
  onChange: (relativePath: string | null) => void;
  onUploadingChange?: (isUploading: boolean) => void;
}

const COVER_HEIGHT = 160;

export function CoverImageUploader({
  relativePath,
  onChange,
  onUploadingChange,
}: CoverImageUploaderProps) {
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const previewUri = localPreview ?? resolveCdnUrl(relativePath);

  const handlePick = useCallback(async () => {
    if (isUploading) {
      return;
    }
    const file = await pickSquareImage();
    if (!file) {
      return;
    }
    setLocalPreview(file.uri);
    setIsUploading(true);
    onUploadingChange?.(true);
    try {
      const uploaded = await uploadSquareImage(file);
      onChange(uploaded.relativePath);
    } catch (error) {
      setLocalPreview(null);
      onChange(null);
      if (!isAxiosError(error)) {
        showErrorToast('封面上传失败，请重试');
      }
    } finally {
      setIsUploading(false);
      onUploadingChange?.(false);
    }
  }, [isUploading, onChange, onUploadingChange]);

  if (previewUri) {
    return (
      <View style={styles.previewWrap}>
        <Image source={{ uri: previewUri }} style={styles.preview} contentFit="cover" />
        {isUploading ? (
          <View style={styles.uploadingMask}>
            <ActivityIndicator color="#FFFFFF" />
          </View>
        ) : (
          <Pressable style={styles.replaceBtn} onPress={() => void handlePick()}>
            <Text style={styles.replaceText}>更换图片</Text>
          </Pressable>
        )}
      </View>
    );
  }

  return (
    <Pressable style={styles.dashed} onPress={() => void handlePick()}>
      {isUploading ? (
        <ActivityIndicator color={ACCENT_COLOR} />
      ) : (
        <Text style={styles.placeholder}>+ 上传封面</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  dashed: {
    height: COVER_HEIGHT,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: PLACEHOLDER_TEXT_COLOR,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAFBFC',
  },
  placeholder: {
    fontSize: 14,
    color: MUTED_TEXT_COLOR,
  },
  previewWrap: {
    height: COVER_HEIGHT,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#F1F5F9',
  },
  preview: {
    width: '100%',
    height: '100%',
  },
  uploadingMask: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.35)',
  },
  replaceBtn: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(15, 23, 42, 0.72)',
  },
  replaceText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
