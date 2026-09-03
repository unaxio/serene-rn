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
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
    backgroundColor: '#EFEDFD',
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 10,
    fontWeight: '600',
    color: ACCENT_COLOR,
  },
});
