import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';

interface StoryCoverImageProps {
  uri: string;
}

const COVER_RADIUS = 12;
const COVER_FALLBACK_ASPECT_RATIO = 16 / 9;
const COVER_BG = '#F1F5F9';

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

  useEffect(() => {
    setAspectRatio(COVER_FALLBACK_ASPECT_RATIO);
  }, [uri]);

  return (
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
  );
}

const styles = StyleSheet.create({
  cover: {
    width: '100%',
    borderRadius: COVER_RADIUS,
    backgroundColor: COVER_BG,
  },
});
