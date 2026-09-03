import { SymbolView } from 'expo-symbols';
import type { ComponentProps } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { MUTED_TEXT_COLOR } from '@/src/features/square/constants';

type SymbolName = ComponentProps<typeof SymbolView>['name'];

interface StoryCardStatsProps {
  resonateCount: number;
  commentCount: number;
  flowerCount: number;
}

const ICON_SIZE = 12;
const ALIGN = ['flex-start', 'center', 'flex-end'] as const;

function StatCell({
  icon,
  count,
  align,
}: {
  icon: SymbolName;
  count: number;
  align: (typeof ALIGN)[number];
}) {
  return (
    <View style={[styles.cell, { alignItems: align }]}>
      <View style={styles.inner}>
        <SymbolView name={icon} size={ICON_SIZE} tintColor={MUTED_TEXT_COLOR} />
        <Text style={styles.text}>{count}</Text>
      </View>
    </View>
  );
}

export function StoryCardStats({
  resonateCount,
  commentCount,
  flowerCount,
}: StoryCardStatsProps) {
  return (
    <View style={styles.row}>
      <StatCell
        icon={{ ios: 'heart', android: 'favorite_border', web: 'favorite_border' }}
        count={resonateCount}
        align={ALIGN[0]}
      />
      <StatCell
        icon={{ ios: 'bubble.left', android: 'chat_bubble_outline', web: 'chat_bubble_outline' }}
        count={commentCount}
        align={ALIGN[1]}
      />
      <StatCell
        icon={{ ios: 'leaf', android: 'local_florist', web: 'local_florist' }}
        count={flowerCount}
        align={ALIGN[2]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  cell: {
    flex: 1,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  text: {
    fontSize: 11,
    color: MUTED_TEXT_COLOR,
  },
});
