import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { APP_TEXT_COLOR } from '@/constants/Colors';
import { ContentMoreButton } from '@/src/features/square/components/ContentMoreButton';
import { ContentMoreOverlays } from '@/src/features/square/components/ContentMoreOverlays';
import { useContentMoreController } from '@/src/features/square/hooks/useContentMoreController';
import type { ContentMoreKind } from '@/src/features/square/utils/contentMoreActions';

interface StoryDetailHeaderProps {
  onBack: () => void;
  targetId: string;
  authorId?: string | null;
  contentKind: ContentMoreKind;
  askId?: string | null;
  onDeleted?: () => void;
}

const ICON_SIZE = 22;
const SIDE_WIDTH = 30;
const HEADER_MIN_HEIGHT = 36;
const HEADER_HORIZONTAL_PADDING = 12;
const MIN_TOP_INSET = 12;

export function StoryDetailHeader({
  onBack,
  targetId,
  authorId = null,
  contentKind,
  askId = null,
  onDeleted,
}: StoryDetailHeaderProps) {
  const insets = useSafeAreaInsets();
  const more = useContentMoreController({
    contentKind,
    targetId,
    authorId,
    askId,
    onDeleted,
  });

  return (
    <View style={[styles.wrap, { paddingTop: insets.top + MIN_TOP_INSET }]}>
      <View style={styles.header}>
        <Pressable onPress={onBack} hitSlop={12} style={styles.side}>
          <SymbolView
            name={{
              ios: 'chevron.left',
              android: 'arrow_back_ios',
              web: 'arrow_back_ios',
            }}
            size={ICON_SIZE}
            tintColor={APP_TEXT_COLOR}
          />
        </Pressable>
        {targetId ? <ContentMoreButton onPress={more.openMenu} /> : <View style={styles.side} />}
      </View>
      <ContentMoreOverlays controller={more} contentKind={contentKind} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: 'transparent',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: HEADER_MIN_HEIGHT,
    paddingHorizontal: HEADER_HORIZONTAL_PADDING,
    paddingBottom: 8,
  },
  side: {
    width: SIDE_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
});
