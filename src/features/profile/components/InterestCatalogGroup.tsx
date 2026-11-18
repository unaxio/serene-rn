import { Pressable, StyleSheet, Text, View } from 'react-native';

import { APP_TEXT_COLOR } from '@/constants/Colors';

const TOPIC_GAP = 8;

interface InterestCatalogGroupProps {
  category: string;
  topics: string[];
  checked: boolean;
  selectedTopics: string[];
  onToggleCategory: (category: string) => void;
  onToggleTopic: (category: string, topic: string) => void;
}

export function InterestCatalogGroup({
  category,
  topics,
  checked,
  selectedTopics,
  onToggleCategory,
  onToggleTopic,
}: InterestCatalogGroupProps) {
  return (
    <View style={styles.group}>
      <Pressable style={styles.head} onPress={() => onToggleCategory(category)}>
        <View style={[styles.box, checked && styles.boxOn]} />
        <Text style={styles.category}>{category}</Text>
      </Pressable>
      <View style={styles.topics}>
        {topics.map((topic) => {
          const on = selectedTopics.includes(topic);
          return (
            <Pressable key={topic} onPress={() => onToggleTopic(category, topic)}>
              <Text style={[styles.topic, on && styles.topicOn]}>{topic}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  group: { marginBottom: 18 },
  head: { flexDirection: 'row', alignItems: 'center' },
  box: {
    width: 16,
    height: 16,
    marginRight: 8,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  boxOn: { backgroundColor: '#64748B', borderColor: '#64748B' },
  category: { fontSize: 17, lineHeight: 24, fontWeight: '600', color: APP_TEXT_COLOR },
  topics: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 10, gap: TOPIC_GAP },
  topic: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    backgroundColor: '#F1F5F9',
    fontSize: 13,
    lineHeight: 18,
    color: '#64748B',
    overflow: 'hidden',
  },
  topicOn: { backgroundColor: '#E2E8F0', color: '#334155', fontWeight: '600' },
});
