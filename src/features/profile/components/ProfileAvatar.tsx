import { Image } from 'expo-image';
import { useCallback, useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ShareImagePreviewModal } from '@/src/features/square/components/share/ShareImagePreviewModal';

interface ProfileAvatarProps {
  uri: string;
  size: number;
  previewable?: boolean;
}

const PREVIEW_INITIAL_INDEX = 0;
const AVATAR_BG = '#E2E8F0';
const AVATAR_FALLBACK_BG = '#CBD5E1';

export function ProfileAvatar({ uri, size, previewable = false }: ProfileAvatarProps) {
  const [previewVisible, setPreviewVisible] = useState(false);
  const previewUris = useMemo(() => (uri ? [uri] : []), [uri]);
  const avatarStyle = useMemo(
    () => ({
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor: AVATAR_BG,
    }),
    [size],
  );

  const openPreview = useCallback(() => {
    setPreviewVisible(true);
  }, []);

  const closePreview = useCallback(() => {
    setPreviewVisible(false);
  }, []);

  const image = uri ? (
    <Image source={{ uri }} style={avatarStyle} contentFit="cover" />
  ) : (
    <View style={[avatarStyle, styles.fallback]} />
  );

  return (
    <>
      {previewable && uri ? <Pressable onPress={openPreview}>{image}</Pressable> : image}
      {previewable ? (
        <ShareImagePreviewModal
          visible={previewVisible}
          uris={previewUris}
          initialIndex={PREVIEW_INITIAL_INDEX}
          onClose={closePreview}
        />
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  fallback: {
    backgroundColor: AVATAR_FALLBACK_BG,
  },
});
