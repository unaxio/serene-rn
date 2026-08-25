import { ActivityIndicator, Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { APP_TEXT_COLOR } from '@/src/features/soulFlower/constants';

interface UseLightCardConfirmModalProps {
  visible: boolean;
  dateLabel: string;
  remainingCount: number;
  isSubmitting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ACCENT = '#F89D34';
const BACKDROP = 'rgba(15, 23, 42, 0.45)';

export function UseLightCardConfirmModal({
  visible,
  dateLabel,
  remainingCount,
  isSubmitting,
  onConfirm,
  onCancel,
}: UseLightCardConfirmModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}>
      <View style={styles.backdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onCancel} />
        <View style={styles.sheet}>
          <Text style={styles.title}>使用续光卡补签？</Text>
          <Text style={styles.body}>
            为 {dateLabel} 补签将消耗 1 张续光卡（当前剩余 {remainingCount} 张）
          </Text>
          <View style={styles.actions}>
            <Pressable
              style={[styles.button, styles.cancel]}
              disabled={isSubmitting}
              onPress={onCancel}>
              <Text style={styles.cancelText}>取消</Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.confirm, isSubmitting && styles.disabled]}
              disabled={isSubmitting || remainingCount <= 0}
              onPress={onConfirm}>
              {isSubmitting ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.confirmText}>确认补签</Text>
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
    maxWidth: 320,
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
    color: '#64748B',
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  button: {
    flex: 1,
    height: 42,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancel: {
    backgroundColor: '#F1F5F9',
  },
  confirm: {
    backgroundColor: ACCENT,
  },
  disabled: {
    opacity: 0.7,
  },
  cancelText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  confirmText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
