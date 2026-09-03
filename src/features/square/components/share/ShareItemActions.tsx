import { Pressable, StyleSheet, Text, View } from 'react-native';

import {
  COMMENT_HIGHLIGHT_COLOR,
  MUTED_TEXT_COLOR,
  SHARE_ACTION_COMMENT_LABEL,
  SHARE_ACTION_FLOWER_LABEL,
  SHARE_ACTION_LIKE_LABEL,
} from '@/src/features/square/constants';

interface ShareItemActionsProps {
  resonateCount: number;
  commentCount: number;
  flowerCount: number;
  isResonated: boolean;
  onResonate: () => void;
  onComment: () => void;
  onFlower: () => void;
}

function ActionText({
  label,
  count,
  active,
  onPress,
}: {
  label: string;
  count: number;
  active?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable hitSlop={8} onPress={onPress}>
      <Text style={[styles.text, active && styles.active]}>
        {label} {count}
      </Text>
    </Pressable>
  );
}

export function ShareItemActions({
  resonateCount,
  commentCount,
  flowerCount,
  isResonated,
  onResonate,
  onComment,
  onFlower,
}: ShareItemActionsProps) {
  return (
    <View style={styles.row}>
      <ActionText
        label={SHARE_ACTION_LIKE_LABEL}
        count={resonateCount}
        active={isResonated}
        onPress={onResonate}
      />
      <ActionText
        label={SHARE_ACTION_COMMENT_LABEL}
        count={commentCount}
        onPress={onComment}
      />
      <ActionText
        label={SHARE_ACTION_FLOWER_LABEL}
        count={flowerCount}
        onPress={onFlower}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  text: {
    fontSize: 13,
    color: MUTED_TEXT_COLOR,
  },
  active: {
    color: COMMENT_HIGHLIGHT_COLOR,
    fontWeight: '600',
  },
});
