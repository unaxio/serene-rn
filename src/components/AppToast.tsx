import { Modal, StyleSheet, Text, View } from 'react-native';

import { useToastStore } from '@/src/store/toastStore';

const TOAST_Z_INDEX = 99999;
const TOAST_MAX_WIDTH = '80%' as const;
const TOAST_BOTTOM_OFFSET = 120;
const TOAST_PADDING_HORIZONTAL = 18;
const TOAST_PADDING_VERTICAL = 12;
const TOAST_BORDER_RADIUS = 22;
const TOAST_FONT_SIZE = 14;
const TOAST_LINE_HEIGHT = 20;

export function AppToast() {
  const message = useToastStore((state) => state.message);
  if (!message) {
    return null;
  }

  return (
    <Modal
      visible
      transparent
      animationType="fade"
      presentationStyle="overFullScreen"
      statusBarTranslucent
      pointerEvents="none">
      <View style={styles.overlay} pointerEvents="none">
        <View style={styles.bubble}>
          <Text style={styles.text}>{message}</Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: TOAST_BOTTOM_OFFSET,
    zIndex: TOAST_Z_INDEX,
    elevation: TOAST_Z_INDEX,
  },
  bubble: {
    maxWidth: TOAST_MAX_WIDTH,
    paddingHorizontal: TOAST_PADDING_HORIZONTAL,
    paddingVertical: TOAST_PADDING_VERTICAL,
    borderRadius: TOAST_BORDER_RADIUS,
    backgroundColor: 'rgba(15, 23, 42, 0.88)',
  },
  text: {
    color: '#FFFFFF',
    fontSize: TOAST_FONT_SIZE,
    lineHeight: TOAST_LINE_HEIGHT,
    textAlign: 'center',
  },
});
