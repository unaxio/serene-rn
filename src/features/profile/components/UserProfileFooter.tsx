import { Pressable, StyleSheet, Text, View } from 'react-native';

import { PROFILE_ACCENT, PROFILE_SURFACE } from '@/src/features/profile/constants';

interface UserProfileFooterProps {
  followLabel: string;
  followPrimary: boolean;
  followDisabled: boolean;
  onFollow: () => void;
  onMessage: () => void;
  onFlower: () => void;
}

export function UserProfileFooter({
  followLabel,
  followPrimary,
  followDisabled,
  onFollow,
  onMessage,
  onFlower,
}: UserProfileFooterProps) {
  return (
    <View style={styles.footer}>
      <Pressable
        style={[styles.btn, followPrimary && styles.primary]}
        disabled={followDisabled}
        onPress={onFollow}>
        <Text style={[styles.text, followPrimary && styles.primaryText]}>{followLabel}</Text>
      </Pressable>
      <Pressable style={styles.btn} onPress={onMessage}>
        <Text style={styles.text}>私信</Text>
      </Pressable>
      <Pressable style={[styles.btn, styles.primary]} onPress={onFlower}>
        <Text style={[styles.text, styles.primaryText]}>送花</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E2E8F0',
    backgroundColor: PROFILE_SURFACE,
  },
  btn: {
    flex: 1,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
  },
  primary: { backgroundColor: PROFILE_ACCENT },
  text: { fontSize: 14, fontWeight: '600', color: '#0F172A' },
  primaryText: { color: '#FFFFFF' },
});
