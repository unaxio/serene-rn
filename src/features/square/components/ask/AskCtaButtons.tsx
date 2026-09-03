import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ACCENT_COLOR, ASK_GO_ANSWER_LABEL, ASK_INVITE_LABEL } from '@/src/features/square/constants';

interface AskCtaButtonsProps {
  onAnswer: () => void;
  onInvite: () => void;
}

const CTA_HEIGHT = 40;

export function AskCtaButtons({ onAnswer, onInvite }: AskCtaButtonsProps) {
  return (
    <View style={styles.ctaRow}>
      <Pressable style={styles.primary} onPress={onAnswer}>
        <Text style={styles.primaryText}>{ASK_GO_ANSWER_LABEL}</Text>
      </Pressable>
      <Pressable style={styles.secondary} onPress={onInvite}>
        <Text style={styles.secondaryText}>{ASK_INVITE_LABEL}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  ctaRow: {
    flexDirection: 'row',
    gap: 10,
  },
  primary: {
    flex: 1,
    height: CTA_HEIGHT,
    borderRadius: CTA_HEIGHT / 2,
    backgroundColor: ACCENT_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  secondary: {
    flex: 1,
    height: CTA_HEIGHT,
    borderRadius: CTA_HEIGHT / 2,
    backgroundColor: '#EFEDFD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryText: {
    color: ACCENT_COLOR,
    fontSize: 15,
    fontWeight: '700',
  },
});
