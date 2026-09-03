import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { APP_TEXT_COLOR } from '@/constants/Colors';
import { AWARENESS_ACCENT_GRADIENT } from '@/src/features/soulFlower/constants';

interface SquareHeaderProps {
  onPublishPress: () => void;
}

const BUTTON_HEIGHT = 32;
const BUTTON_RADIUS = BUTTON_HEIGHT / 2;

export function SquareHeader({ onPublishPress }: SquareHeaderProps) {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>广场</Text>
      <Pressable onPress={onPublishPress}>
        <LinearGradient
          colors={[...AWARENESS_ACCENT_GRADIENT]}
          locations={[0, 0.5, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.button}>
          <Text style={styles.buttonText}>发布</Text>
        </LinearGradient>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: APP_TEXT_COLOR,
  },
  button: {
    height: BUTTON_HEIGHT,
    paddingHorizontal: 16,
    borderRadius: BUTTON_RADIUS,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
