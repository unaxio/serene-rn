import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ACCENT_COLOR, TOPIC_CHIP_BG, TOPIC_CHIP_FONT_SIZE, TOPIC_HASH } from '@/src/features/square/constants';

interface SearchTopicRowProps {
  topics: string[];
  onPress: (name: string) => void;
}

const CHIP_RADIUS = 4;
const ROW_GAP = 8;

export function SearchTopicRow({ topics, onPress }: SearchTopicRowProps) {
  if (topics.length === 0) {
    return null;
  }
  return (
    <View style={styles.row}>
      {topics.map((name) => (
        <Pressable key={name} style={styles.chip} onPress={() => onPress(name)}>
          <Text style={styles.text} numberOfLines={1}>
            {`${TOPIC_HASH}${name}`}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: ROW_GAP,
    marginBottom: ROW_GAP,
  },
  chip: {
    maxWidth: '100%',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: CHIP_RADIUS,
    backgroundColor: TOPIC_CHIP_BG,
  },
  text: {
    fontSize: TOPIC_CHIP_FONT_SIZE,
    color: ACCENT_COLOR,
  },
});
