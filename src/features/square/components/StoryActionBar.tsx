import { SymbolView } from 'expo-symbols';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { APP_TEXT_COLOR } from '@/constants/Colors';
import { COMMENT_HIGHLIGHT_COLOR, MUTED_TEXT_COLOR } from '@/src/features/square/constants';

type SymbolName = ComponentProps<typeof SymbolView>['name'];

interface StoryActionBarProps {
  resonateCount: number;
  collectCount: number;
  flowerCount: number;
  commentCount: number;
  isResonated: boolean;
  isCollected: boolean;
  onResonate: () => void;
  onCollect: () => void;
  onFlower: () => void;
  onComment: () => void;
  onShare: () => void;
}

const ICON_SIZE = 20;
const BAR_MIN_HEIGHT = 52;

interface ActionItemProps {
  icon: SymbolName;
  label?: string;
  active?: boolean;
  onPress: () => void;
}

function ActionItem({ icon, label, active = false, onPress }: ActionItemProps) {
  const color = active ? COMMENT_HIGHLIGHT_COLOR : APP_TEXT_COLOR;
  return (
    <Pressable style={styles.item} onPress={onPress}>
      <SymbolView name={icon} size={ICON_SIZE} tintColor={color} />
      {label !== undefined ? (
        <Text style={[styles.count, active && styles.countActive]}>{label}</Text>
      ) : null}
    </Pressable>
  );
}

export function StoryActionBar({
  resonateCount,
  collectCount,
  flowerCount,
  commentCount,
  isResonated,
  isCollected,
  onResonate,
  onCollect,
  onFlower,
  onComment,
  onShare,
}: StoryActionBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      <ActionItem
        icon={{ ios: 'heart', android: 'favorite_border', web: 'favorite_border' }}
        label={String(resonateCount)}
        active={isResonated}
        onPress={onResonate}
      />
      <ActionItem
        icon={{ ios: 'star', android: 'star_border', web: 'star_border' }}
        label={String(collectCount)}
        active={isCollected}
        onPress={onCollect}
      />
      <ActionItem
        icon={{ ios: 'leaf', android: 'local_florist', web: 'local_florist' }}
        label={String(flowerCount)}
        onPress={onFlower}
      />
      <ActionItem
        icon={{ ios: 'bubble.left', android: 'chat_bubble_outline', web: 'chat_bubble_outline' }}
        label={String(commentCount)}
        onPress={onComment}
      />
      <ActionItem
        icon={{ ios: 'square.and.arrow.up', android: 'share', web: 'share' }}
        onPress={onShare}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    minHeight: BAR_MIN_HEIGHT,
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E8E6F2',
    backgroundColor: '#FFFFFF',
  },
  item: {
    alignItems: 'center',
    gap: 2,
    minWidth: 48,
  },
  count: {
    fontSize: 11,
    color: MUTED_TEXT_COLOR,
  },
  countActive: {
    color: COMMENT_HIGHLIGHT_COLOR,
    fontWeight: '600',
  },
});
