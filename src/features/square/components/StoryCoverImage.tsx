import { Image } from 'expo-image';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { ShareImagePreviewModal } from '@/src/features/square/components/share/ShareImagePreviewModal';

interface StoryCoverImageProps {
  uri: string;
}

const COVER_RADIUS = 12;
const COVER_FALLBACK_ASPECT_RATIO = 16 / 9;
const COVER_BG = '#F1F5F9';
const PREVIEW_INITIAL_INDEX = 0;

function readAspectRatio(event: {
  source?: { width?: number; height?: number };
  nativeEvent?: { source?: { width?: number; height?: number } };
}): number | null {
  const source = event.source ?? event.nativeEvent?.source;
  const width = source?.width;
  const height = source?.height;
  if (!width || !height || width <= 0 || height <= 0) {
    return null;
  }
  return width / height;
}

export function StoryCoverImage({ uri }: StoryCoverImageProps) {
  const [aspectRatio, setAspectRatio] = useState(COVER_FALLBACK_ASPECT_RATIO);
  const [previewVisible, setPreviewVisible] = useState(false);
  const previewUris = useMemo(() => [uri], [uri]);

  useEffect(() => {
    setAspectRatio(COVER_FALLBACK_ASPECT_RATIO);
  }, [uri]);

  const openPreview = useCallback(() => {
    setPreviewVisible(true);
  }, []);

  const closePreview = useCallback(() => {
    setPreviewVisible(false);
  }, []);

  return (
    <>
      <Pressable onPress={openPreview}>
        <Image
          source={{ uri }}
          style={[styles.cover, { aspectRatio }]}
          contentFit="contain"
          onLoad={(event) => {
            const next = readAspectRatio(event);
            if (next) {
              setAspectRatio(next);
            }
          }}
        />
      </Pressable>
      <ShareImagePreviewModal
        visible={previewVisible}
        uris={previewUris}
        initialIndex={PREVIEW_INITIAL_INDEX}
        onClose={closePreview}
      />
    </>
  );
}

const styles = StyleSheet.create({
  cover: {
    width: '100%',
    borderRadius: COVER_RADIUS,
    backgroundColor: COVER_BG,
  },
});
