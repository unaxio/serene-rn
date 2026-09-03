import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

import { APP_TEXT_COLOR } from '@/constants/Colors';
import { FlowerQuantityStepper } from '@/src/features/square/components/FlowerQuantityStepper';
import {
  ACCENT_COLOR,
  FLOWER_QUANTITY_MIN,
  MUTED_TEXT_COLOR,
  PLACEHOLDER_TEXT_COLOR,
} from '@/src/features/square/constants';

interface SendFlowerModalProps {
  visible: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (quantity: number, message: string) => Promise<boolean>;
}

const BACKDROP = 'rgba(15, 23, 42, 0.45)';
const MESSAGE_MAX_LENGTH = 50;

export function SendFlowerModal({
  visible,
  isSubmitting,
  onClose,
  onSubmit,
}: SendFlowerModalProps) {
  const [quantity, setQuantity] = useState(FLOWER_QUANTITY_MIN);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (visible) {
      setQuantity(FLOWER_QUANTITY_MIN);
      setMessage('');
    }
  }, [visible]);

  const handleSubmit = useCallback(async () => {
    const ok = await onSubmit(quantity, message.trim());
    if (ok) {
      onClose();
    }
  }, [message, onClose, onSubmit, quantity]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <Pressable style={styles.close} onPress={onClose} hitSlop={12}>
            <Text style={styles.closeText}>✕</Text>
          </Pressable>
          <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
            <Text style={styles.title}>送花</Text>
            <FlowerQuantityStepper quantity={quantity} onChange={setQuantity} />
            <TextInput
              style={styles.input}
              value={message}
              onChangeText={setMessage}
              placeholder="可填写附言（选填）"
              placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
              maxLength={MESSAGE_MAX_LENGTH}
            />
            <Pressable
              style={[styles.submit, isSubmitting && styles.disabled]}
              disabled={isSubmitting}
              onPress={() => {
                void handleSubmit();
              }}>
              {isSubmitting ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.submitText}>赠送</Text>
              )}
            </Pressable>
          </KeyboardAwareScrollView>
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
  },
  close: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 1,
  },
  closeText: {
    fontSize: 18,
    color: MUTED_TEXT_COLOR,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: APP_TEXT_COLOR,
    textAlign: 'center',
    marginBottom: 16,
  },
  input: {
    height: 42,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 12,
    fontSize: 14,
    color: APP_TEXT_COLOR,
    marginBottom: 16,
  },
  submit: {
    height: 42,
    borderRadius: 10,
    backgroundColor: ACCENT_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.7,
  },
  submitText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
