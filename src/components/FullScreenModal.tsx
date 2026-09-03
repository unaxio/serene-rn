import { SymbolView } from 'expo-symbols';
import type { ReactNode } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { APP_TEXT_COLOR } from '@/constants/Colors';

type FullScreenModalAnimation = 'slide' | 'fade';

type FullScreenModalPresentation = 'pageSheet' | 'overFullScreen';

interface FullScreenModalProps {
  visible: boolean;
  title: string;
  onBack: () => void;
  children: ReactNode;
  backgroundColor?: string;
  animationType?: FullScreenModalAnimation;
  presentationStyle?: FullScreenModalPresentation;
}

const BACK_ICON_SIZE = 22;
const BACK_BUTTON_WIDTH = 30;
const HEADER_MIN_HEIGHT = 36;
const HEADER_HORIZONTAL_PADDING = 12;
const HEADER_TITLE_SIZE = 18;
const MIN_TOP_INSET = 12;
const DEFAULT_BACKGROUND = '#FFFFFF';

const DEFAULT_ANIMATION_TYPE: FullScreenModalAnimation = 'slide';

const DEFAULT_PRESENTATION_STYLE: FullScreenModalPresentation = 'pageSheet';

export function FullScreenModal({
  visible,
  title,
  onBack,
  children,
  backgroundColor = DEFAULT_BACKGROUND,
  animationType = DEFAULT_ANIMATION_TYPE,
  presentationStyle = DEFAULT_PRESENTATION_STYLE,
}: FullScreenModalProps) {
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      animationType={animationType}
      presentationStyle={presentationStyle}
      onRequestClose={onBack}>
      <View
        style={[
          styles.container,
          { backgroundColor, paddingTop: Math.max(insets.top, MIN_TOP_INSET) },
        ]}>
        <View style={styles.header}>
          <Pressable onPress={onBack} hitSlop={12} style={styles.backButton}>
            <SymbolView
              name={{
                ios: 'chevron.left',
                android: 'arrow_back_ios',
                web: 'arrow_back_ios',
              }}
              size={BACK_ICON_SIZE}
              tintColor={APP_TEXT_COLOR}
            />
          </Pressable>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          <View style={styles.headerSide} />
        </View>
        <View style={styles.body}>{children}</View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: HEADER_MIN_HEIGHT,
    paddingHorizontal: HEADER_HORIZONTAL_PADDING,
    paddingBottom: 8,
  },
  headerSide: {
    width: BACK_BUTTON_WIDTH,
  },
  backButton: {
    width: BACK_BUTTON_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: HEADER_TITLE_SIZE,
    fontWeight: '700',
    color: APP_TEXT_COLOR,
  },
  body: {
    flex: 1,
  },
});
