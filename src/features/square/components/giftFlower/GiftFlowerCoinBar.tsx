import { Pressable, StyleSheet, Text, View } from 'react-native';

import { APP_TEXT_COLOR } from '@/constants/Colors';
import {
  ACCENT_COLOR,
  GIFT_FLOWER_BUY_ENTRY,
  GIFT_FLOWER_COIN_LABEL,
} from '@/src/features/square/constants';

interface GiftFlowerCoinBarProps {
  flowerCoin: number;
  actionLabel?: string;
  onAction?: () => void;
}

export function GiftFlowerCoinBar({
  flowerCoin,
  actionLabel = GIFT_FLOWER_BUY_ENTRY,
  onAction,
}: GiftFlowerCoinBarProps) {
  return (
    <View style={styles.bar}>
      <Text style={styles.balance}>
        {GIFT_FLOWER_COIN_LABEL} {flowerCoin}
      </Text>
      {onAction ? (
        <Pressable onPress={onAction} hitSlop={8}>
          <Text style={styles.action}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E8E6F2',
  },
  balance: {
    fontSize: 14,
    fontWeight: '600',
    color: APP_TEXT_COLOR,
  },
  action: {
    fontSize: 14,
    fontWeight: '600',
    color: ACCENT_COLOR,
  },
});
