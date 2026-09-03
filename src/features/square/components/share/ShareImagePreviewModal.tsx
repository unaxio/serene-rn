import { Image } from 'expo-image';
import { useEffect, useRef, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
  type NativeSyntheticEvent,
  type NativeScrollEvent,
} from 'react-native';

import { FullScreenModal } from '@/src/components/FullScreenModal';
import {
  SHARE_IMAGE_PREVIEW_TITLE,
  SHARE_PREVIEW_BG,
} from '@/src/features/square/constants';

interface ShareImagePreviewModalProps {
  uris: string[];
  initialIndex: number;
  visible: boolean;
  onClose: () => void;
}

const PREVIEW_ANIMATION = 'fade' as const;
const PREVIEW_PRESENTATION = 'overFullScreen' as const;

export function ShareImagePreviewModal({
  uris,
  initialIndex,
  visible,
  onClose,
}: ShareImagePreviewModalProps) {
  const { width } = useWindowDimensions();
  const scrollRef = useRef<ScrollView>(null);
  const [index, setIndex] = useState(initialIndex);
  const title =
    uris.length > 1
      ? `${SHARE_IMAGE_PREVIEW_TITLE} ${index + 1}/${uris.length}`
      : SHARE_IMAGE_PREVIEW_TITLE;

  useEffect(() => {
    if (!visible) {
      return;
    }
    setIndex(initialIndex);
    const frame = requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ x: initialIndex * width, animated: false });
    });
    return () => cancelAnimationFrame(frame);
  }, [initialIndex, visible, width]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const next = Math.round(event.nativeEvent.contentOffset.x / width);
    if (next >= 0 && next < uris.length) {
      setIndex(next);
    }
  };

  return (
    <FullScreenModal
      visible={visible}
      title={title}
      onBack={onClose}
      animationType={PREVIEW_ANIMATION}
      presentationStyle={PREVIEW_PRESENTATION}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        style={styles.pager}>
        {uris.map((uri) => (
          <View key={uri} style={[styles.page, { width }]}>
            <Image source={{ uri }} style={styles.image} contentFit="contain" />
          </View>
        ))}
      </ScrollView>
    </FullScreenModal>
  );
}

const styles = StyleSheet.create({
  pager: {
    flex: 1,
    backgroundColor: SHARE_PREVIEW_BG,
  },
  page: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
