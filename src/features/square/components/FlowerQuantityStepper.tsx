import { Pressable, StyleSheet, Text, View } from 'react-native';

import { APP_TEXT_COLOR } from '@/constants/Colors';
import {
  FLOWER_QUANTITY_MAX,
  FLOWER_QUANTITY_MIN,
} from '@/src/features/square/constants';

interface FlowerQuantityStepperProps {
  quantity: number;
  onChange: (quantity: number) => void;
}

export function FlowerQuantityStepper({ quantity, onChange }: FlowerQuantityStepperProps) {
  return (
    <View style={styles.stepper}>
      <Pressable
        style={styles.stepBtn}
        disabled={quantity <= FLOWER_QUANTITY_MIN}
        onPress={() => onChange(Math.max(FLOWER_QUANTITY_MIN, quantity - 1))}>
        <Text style={styles.stepText}>-</Text>
      </Pressable>
      <Text style={styles.quantity}>{quantity}</Text>
      <Pressable
        style={styles.stepBtn}
        disabled={quantity >= FLOWER_QUANTITY_MAX}
        onPress={() => onChange(Math.min(FLOWER_QUANTITY_MAX, quantity + 1))}>
        <Text style={styles.stepText}>+</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 16,
  },
  stepBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepText: {
    fontSize: 20,
    color: APP_TEXT_COLOR,
  },
  quantity: {
    fontSize: 22,
    fontWeight: '700',
    color: APP_TEXT_COLOR,
    minWidth: 32,
    textAlign: 'center',
  },
});
