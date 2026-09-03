import { LinearGradient } from 'expo-linear-gradient';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import {
  AWARENESS_ACCENT_GRADIENT,
  AWARENESS_ACCENT_GRADIENT_LOCATIONS,
} from '@/src/features/soulFlower/constants';

interface PublishSubmitButtonProps {
  enabled: boolean;
  isSubmitting: boolean;
  onPress: () => void;
  label?: string;
}

const BUTTON_HEIGHT = 44;
const BUTTON_RADIUS = BUTTON_HEIGHT / 2;
const DEFAULT_LABEL = '发布';

export function PublishSubmitButton({
  enabled,
  isSubmitting,
  onPress,
  label = DEFAULT_LABEL,
}: PublishSubmitButtonProps) {
  const canPress = enabled && !isSubmitting;

  return (
    <Pressable disabled={!canPress} onPress={onPress}>
      <View style={[styles.wrap, !canPress && styles.disabled]}>
        <LinearGradient
          colors={[...AWARENESS_ACCENT_GRADIENT]}
          locations={[...AWARENESS_ACCENT_GRADIENT_LOCATIONS]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.button}>
          {isSubmitting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.text}>{label}</Text>
          )}
        </LinearGradient>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: BUTTON_RADIUS,
    overflow: 'hidden',
  },
  disabled: {
    opacity: 0.4,
  },
  button: {
    height: BUTTON_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
