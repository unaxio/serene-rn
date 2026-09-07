import { SymbolView } from 'expo-symbols';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';

import { APP_TEXT_COLOR } from '@/constants/Colors';

import { BottomSheetModal } from '@/src/components/BottomSheetModal';

interface PercentSheetModalProps {
  visible: boolean;
  title: string;
  onBack: () => void;
  children: ReactNode;
  heightRatio?: number;
}

const DEFAULT_HEIGHT_RATIO = 0.8;
const BACK_ICON_SIZE = 22;
const BACK_BUTTON_WIDTH = 30;
const HEADER_MIN_HEIGHT = 36;
const HEADER_HORIZONTAL_PADDING = 12;
const HEADER_TITLE_SIZE = 18;
const SHEET_RADIUS = 16;
const HANDLE_WIDTH = 36;
const HANDLE_HEIGHT = 4;
const HANDLE_TOP_PADDING = 8;

export function PercentSheetModal({
  visible,
  title,
  onBack,
  children,
  heightRatio = DEFAULT_HEIGHT_RATIO,
}: PercentSheetModalProps) {
  const { height: windowHeight } = useWindowDimensions();

  return (
    <BottomSheetModal visible={visible} onClose={onBack}>
      <View style={[styles.sheet, { height: windowHeight * heightRatio }]}>
        <View style={styles.handle} />
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
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: SHEET_RADIUS,
    borderTopRightRadius: SHEET_RADIUS,
    overflow: 'hidden',
  },
  handle: {
    alignSelf: 'center',
    width: HANDLE_WIDTH,
    height: HANDLE_HEIGHT,
    marginTop: HANDLE_TOP_PADDING,
    borderRadius: HANDLE_HEIGHT / 2,
    backgroundColor: '#D1D5DB',
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
