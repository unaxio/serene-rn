import { Pressable, StyleSheet, Text, View } from 'react-native';

import { APP_TEXT_COLOR } from '@/constants/Colors';
import { PROFILE_ACCENT, PROFILE_MUTED } from '@/src/features/profile/constants';
import type { PrivacySettings } from '@/src/features/profile/types';

type MessagePermission = PrivacySettings['messagePermission'];

const OPTIONS: Array<{ value: MessagePermission; label: string; hint: string }> = [
  { value: 'everyone', label: '所有人', hint: '除黑名单外都可以给你发私信' },
  { value: 'followers', label: '仅粉丝', hint: '只有关注了你的人可以发私信' },
  { value: 'off', label: '关闭', hint: '不接收任何人的私信' },
];

interface MessagePermissionFieldProps {
  value: MessagePermission;
  onChange: (value: MessagePermission) => void;
}

export function MessagePermissionField({ value, onChange }: MessagePermissionFieldProps) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>谁可以给我发私信</Text>
      {OPTIONS.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable key={option.value} style={styles.row} onPress={() => onChange(option.value)}>
            <View style={[styles.radio, selected && styles.radioOn]} />
            <View style={styles.copy}>
              <Text style={styles.label}>{option.label}</Text>
              <Text style={styles.hint}>{option.hint}</Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 8 },
  title: { fontSize: 15, fontWeight: '600', color: APP_TEXT_COLOR },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  radio: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
  },
  radioOn: { borderColor: PROFILE_ACCENT, backgroundColor: PROFILE_ACCENT },
  copy: { flex: 1, gap: 2 },
  label: { fontSize: 14, color: APP_TEXT_COLOR },
  hint: { fontSize: 12, color: PROFILE_MUTED },
});
