import { ActivityIndicator, Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { APP_TEXT_COLOR } from '@/constants/Colors';
import { MUTED_TEXT_COLOR } from '@/src/features/square/constants';

interface ConfirmDangerModalProps {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  isSubmitting?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const BACKDROP = 'rgba(15, 23, 42, 0.45)';
const DANGER_COLOR = '#DC2626';
const SHEET_MAX_WIDTH = 320;
const BUTTON_HEIGHT = 42;
const BUTTON_RADIUS = 10;

export function ConfirmDangerModal({
  visible,
  title,
  message,
  confirmLabel,
  isSubmitting = false,
  onConfirm,
  onCancel,
}: ConfirmDangerModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.backdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onCancel} />
        <View style={styles.sheet}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.body}>{message}</Text>
          <View style={styles.actions}>
            <Pressable
              style={[styles.button, styles.cancel]}
              disabled={isSubmitting}
              onPress={onCancel}>
              <Text style={styles.cancelText}>取消</Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.confirm, isSubmitting && styles.disabled]}
              disabled={isSubmitting}
              onPress={onConfirm}>
              {isSubmitting ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.confirmText}>{confirmLabel}</Text>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: BACKDROP,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  sheet: {
    width: '100%',
    maxWidth: SHEET_MAX_WIDTH,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    gap: 12,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: APP_TEXT_COLOR,
    textAlign: 'center',
  },
  body: {
    fontSize: 14,
    lineHeight: 22,
    color: MUTED_TEXT_COLOR,
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  button: {
    flex: 1,
    height: BUTTON_HEIGHT,
    borderRadius: BUTTON_RADIUS,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancel: {
    backgroundColor: '#F1F5F9',
  },
  confirm: {
    backgroundColor: DANGER_COLOR,
  },
  disabled: {
    opacity: 0.7,
  },
  cancelText: {
    fontSize: 14,
    fontWeight: '600',
    color: MUTED_TEXT_COLOR,
  },
  confirmText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
