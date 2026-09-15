import { StyleSheet, Text, View } from 'react-native';

import { PROFILE_MUTED, PROFILE_SURFACE } from '@/src/features/profile/constants';

interface ProfileEmptyPaneProps {
  message: string;
}

export function ProfileEmptyPane({ message }: ProfileEmptyPaneProps) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    minHeight: 180,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    backgroundColor: PROFILE_SURFACE,
  },
  text: {
    fontSize: 14,
    color: PROFILE_MUTED,
  },
});
