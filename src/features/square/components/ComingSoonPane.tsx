import { StyleSheet, Text, View } from 'react-native';

import { MUTED_TEXT_COLOR } from '@/src/features/square/constants';

interface ComingSoonPaneProps {
  message: string;
}

export function ComingSoonPane({ message }: ComingSoonPaneProps) {
  return (
    <View style={styles.pane}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pane: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  text: {
    fontSize: 14,
    color: MUTED_TEXT_COLOR,
  },
});
