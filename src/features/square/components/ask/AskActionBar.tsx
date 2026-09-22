import { SymbolView } from 'expo-symbols';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { APP_TEXT_COLOR } from '@/constants/Colors';
import {
  ASK_COLLECT_LABEL,
  ASK_SHARE_LABEL,
  COMMENT_HIGHLIGHT_COLOR,
  MUTED_TEXT_COLOR,
  SHARE_ACTION_FLOWER_LABEL,
} from '@/src/features/square/constants';

type SymbolName = ComponentProps<typeof SymbolView>['name'];

interface AskActionBarProps {
  flowerCount: number;
  collectCount: number;
  isCollected: boolean;
  isFlowered: boolean;
  onFlower: () => void;
  onShare: () => void;
  onCollect: () => void;
}

const ICON_SIZE = 20;
const BAR_MIN_HEIGHT = 52;
const MIN_BOTTOM_INSET = 8;

interface ActionItemProps {
  icon: SymbolName;
  label: string;
  active?: boolean;
  onPress: () => void;
}

function ActionItem({ icon, label, active = false, onPress }: ActionItemProps) {
  const color = active ? COMMENT_HIGHLIGHT_COLOR : APP_TEXT_COLOR;
  return (
    <Pressable style={styles.item} onPress={onPress}>
      <SymbolView name={icon} size={ICON_SIZE} tintColor={color} />
      <Text style={[styles.label, active && styles.labelActive]}>{label}</Text>
    </Pressable>
  );
}

export function AskActionBar({
  flowerCount,
  collectCount,
  isCollected,
  isFlowered,
  onFlower,
  onShare,
  onCollect,
}: AskActionBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, MIN_BOTTOM_INSET) }]}>
      <ActionItem
        icon={{ ios: 'leaf', android: 'local_florist', web: 'local_florist' }}
        label={`${SHARE_ACTION_FLOWER_LABEL} ${flowerCount}`}
        active={isFlowered}
        onPress={onFlower}
      />
      <ActionItem
        icon={{ ios: 'square.and.arrow.up', android: 'share', web: 'share' }}
        label={ASK_SHARE_LABEL}
        onPress={onShare}
      />
      <ActionItem
        icon={{ ios: 'star', android: 'star_border', web: 'star_border' }}
        label={`${ASK_COLLECT_LABEL} ${collectCount}`}
        active={isCollected}
        onPress={onCollect}
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
    minWidth: 64,
  },
  label: {
    fontSize: 11,
    color: MUTED_TEXT_COLOR,
  },
  labelActive: {
    color: COMMENT_HIGHLIGHT_COLOR,
    fontWeight: '600',
  },
});
