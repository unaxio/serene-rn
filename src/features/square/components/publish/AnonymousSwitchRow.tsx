import { StyleSheet, Switch, Text, View } from 'react-native';

import { APP_TEXT_COLOR } from '@/constants/Colors';
import { ACCENT_COLOR, MUTED_TEXT_COLOR } from '@/src/features/square/constants';

interface AnonymousSwitchRowProps {
  value: boolean;
  onChange: (value: boolean) => void;
}

export function AnonymousSwitchRow({ value, onChange }: AnonymousSwitchRowProps) {
  return (
    <View style={styles.row}>
      <View style={styles.copy}>
        <Text style={styles.title}>匿名发布</Text>
        {value ? (
          <Text style={styles.hint}>开启后，你的昵称和头像将不对外展示</Text>
        ) : null}
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: '#E2E8F0', true: ACCENT_COLOR }}
        thumbColor="#FFFFFF"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  copy: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: APP_TEXT_COLOR,
  },
  hint: {
    fontSize: 12,
    lineHeight: 18,
    color: MUTED_TEXT_COLOR,
  },
});
