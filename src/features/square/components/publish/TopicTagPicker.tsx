import { Pressable, StyleSheet, Text, View } from 'react-native';

import { APP_TEXT_COLOR } from '@/constants/Colors';
import {
  ACCENT_COLOR,
  MUTED_TEXT_COLOR,
  STORY_TOPIC_OPTIONS,
} from '@/src/features/square/constants';

interface TopicTagPickerProps {
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function TopicTagPicker({ selectedId, onSelect }: TopicTagPickerProps) {
  return (
    <View style={styles.block}>
      <Text style={styles.label}>选择话题标签</Text>
      <View style={styles.row}>
        {STORY_TOPIC_OPTIONS.map((option) => {
          const isActive = option.id === selectedId;
          return (
            <Pressable
              key={option.id}
              style={styles.option}
              onPress={() => onSelect(option.id)}>
              <Text style={[styles.optionText, isActive && styles.optionTextActive]}>
                {option.name}
              </Text>
              {isActive ? <View style={styles.underline} /> : <View style={styles.underlineSpacer} />}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    gap: 10,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: APP_TEXT_COLOR,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  option: {
    alignItems: 'center',
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
    color: MUTED_TEXT_COLOR,
  },
  optionTextActive: {
    fontWeight: '700',
    color: APP_TEXT_COLOR,
  },
  underline: {
    marginTop: 6,
    height: 2,
    alignSelf: 'stretch',
    backgroundColor: ACCENT_COLOR,
  },
  underlineSpacer: {
    marginTop: 6,
    height: 2,
  },
});
