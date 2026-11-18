import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text } from 'react-native';

import { APP_TEXT_COLOR } from '@/constants/Colors';
import { PROFILE_MUTED } from '@/src/features/profile/constants';

export function PrivacyInterestsEntry() {
  const router = useRouter();
  return (
    <Pressable style={styles.entry} onPress={() => router.push('/profile/settings/interests')}>
      <Text style={styles.label}>内容偏好管理</Text>
      <Text style={styles.chevron}>›</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  entry: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: { fontSize: 15, color: APP_TEXT_COLOR },
  chevron: { fontSize: 18, color: PROFILE_MUTED },
});
