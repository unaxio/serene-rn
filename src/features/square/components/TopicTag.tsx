import { StyleSheet, Text, View } from 'react-native';

import { ACCENT_COLOR } from '@/src/features/square/constants';

interface TopicTagProps {
  label: string;
}

export function TopicTag({ label }: TopicTagProps) {
  return (
    <View style={styles.tag}>
      <Text style={styles.text}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    backgroundColor: '#EFEDFD',
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 11,
    fontWeight: '600',
    color: ACCENT_COLOR,
  },
});
