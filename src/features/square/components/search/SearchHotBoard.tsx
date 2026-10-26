import { Pressable, Text, View } from 'react-native';

import { SEARCH_HOT_TOP_RANK } from '@/src/features/square/constants';
import type { SearchHotItem } from '@/src/features/square/types';

import { searchDiscoverStyles as styles } from '@/src/features/square/components/search/searchDiscoverStyles';

interface SearchHotBoardProps {
  title: string;
  items: SearchHotItem[];
  onPress: (id: string) => void;
}

export function SearchHotBoard({ title, items, onPress }: SearchHotBoardProps) {
  if (items.length === 0) {
    return null;
  }
  return (
    <View style={styles.section}>
      <Text style={styles.heading}>{title}</Text>
      {items.map((item) => (
        <Pressable key={item.id} style={styles.row} onPress={() => onPress(item.id)}>
          <Text style={[styles.rank, item.rank <= SEARCH_HOT_TOP_RANK ? styles.rankTop : null]}>
            {item.rank}
          </Text>
          <Text style={styles.title} numberOfLines={1}>
            {item.title}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
