import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

interface CommentComposerLayerProps {
  visible: boolean;
  onDismiss: () => void;
  children: ReactNode;
}

/**
 * 底部评论输入层：透明全屏 backdrop 点按关闭，输入条浮在上方。
 */
export function CommentComposerLayer({
  visible,
  onDismiss,
  children,
}: CommentComposerLayerProps) {
  if (!visible) {
    return null;
  }

  return (
    <View style={styles.root} pointerEvents="box-none">
      <Pressable
        style={styles.backdrop}
        onPress={onDismiss}
        accessibilityRole="button"
        accessibilityLabel="关闭评论输入"
      />
      <View style={styles.composer} pointerEvents="box-none">
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    justifyContent: 'flex-end',
    zIndex: 20,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'transparent',
  },
  composer: {
    zIndex: 1,
  },
});
