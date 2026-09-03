import type { ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  View,
  type LayoutChangeEvent,
} from 'react-native';
import Animated, {
  Easing,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

interface BottomSheetModalProps {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
}

const ANIMATION_DURATION_MS = 280;
const BACKDROP_COLOR = 'rgba(15, 23, 42, 0.45)';

export function BottomSheetModal({ visible, onClose, children }: BottomSheetModalProps) {
  const [mounted, setMounted] = useState(false);
  const wasMountedRef = useRef(false);
  const hasOpenedRef = useRef(false);
  const progress = useSharedValue(0);
  const sheetHeight = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      wasMountedRef.current = true;
      hasOpenedRef.current = false;
      progress.value = 0;
      setMounted(true);
      return;
    }
    if (!wasMountedRef.current) {
      return;
    }
    progress.value = withTiming(
      0,
      { duration: ANIMATION_DURATION_MS, easing: Easing.in(Easing.cubic) },
      (finished) => {
        if (!finished) {
          return;
        }
        wasMountedRef.current = false;
        runOnJS(setMounted)(false);
      },
    );
  }, [progress, visible]);

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
  }));

  const sheetStyle = useAnimatedStyle(() => ({
    opacity: sheetHeight.value > 0 ? 1 : 0,
    transform: [
      {
        translateY: interpolate(progress.value, [0, 1], [sheetHeight.value, 0]),
      },
    ],
  }));

  const handleSheetLayout = (event: LayoutChangeEvent) => {
    const height = event.nativeEvent.layout.height;
    if (height <= 0) {
      return;
    }
    sheetHeight.value = height;
    if (!visible || hasOpenedRef.current) {
      return;
    }
    hasOpenedRef.current = true;
    progress.value = withTiming(1, {
      duration: ANIMATION_DURATION_MS,
      easing: Easing.out(Easing.cubic),
    });
  };

  if (!mounted) {
    return null;
  }

  return (
    <Modal
      visible
      transparent
      animationType="none"
      presentationStyle="overFullScreen"
      statusBarTranslucent
      onRequestClose={onClose}>
      <View style={styles.root} pointerEvents="box-none">
        <Animated.View style={[styles.backdrop, backdropStyle]}>
          <Pressable style={styles.dismiss} onPress={onClose} />
        </Animated.View>
        <Animated.View style={[styles.sheetAnchor, sheetStyle]} onLayout={handleSheetLayout}>
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: BACKDROP_COLOR,
  },
  dismiss: {
    flex: 1,
  },
  sheetAnchor: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
});
