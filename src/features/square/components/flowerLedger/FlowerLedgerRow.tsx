import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

import { APP_TEXT_COLOR } from '@/constants/Colors';
import { SquareUserAvatar } from '@/src/features/square/components/SquareUserAvatar';
import {
  CARD_BORDER_COLOR,
  FLOWER_LEDGER_ROW_FLOWER_SIZE,
  MUTED_TEXT_COLOR,
} from '@/src/features/square/constants';
import type { GiftFlowerLedger } from '@/src/features/square/types';
import { getAuthorDisplayName } from '@/src/features/square/utils/displayAuthor';
import { resolveCdnUrl } from '@/src/utils/cdn';

interface FlowerLedgerRowProps {
  item: GiftFlowerLedger;
}

const ROW_AVATAR_SIZE = 40;
const DIVIDER_HEIGHT = StyleSheet.hairlineWidth;

export function FlowerLedgerRow({ item }: FlowerLedgerRowProps) {
  const flowerUri = resolveCdnUrl(item.giftFlower.imagePath);

  return (
    <View style={styles.row}>
      <View style={styles.sender}>
        <SquareUserAvatar author={item.sender} size={ROW_AVATAR_SIZE} />
        <Text style={styles.name} numberOfLines={1}>
          {getAuthorDisplayName(item.sender)}
        </Text>
      </View>
      <View style={styles.gift}>
        {flowerUri ? (
          <Image source={{ uri: flowerUri }} style={styles.flower} contentFit="contain" />
        ) : (
          <View style={styles.flowerPlaceholder} />
        )}
        <Text style={styles.quantity}>{`×${item.quantity}`}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: DIVIDER_HEIGHT,
    borderBottomColor: CARD_BORDER_COLOR,
    gap: 12,
  },
  sender: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    minWidth: 0,
  },
  name: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: APP_TEXT_COLOR,
  },
  gift: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  flower: {
    width: FLOWER_LEDGER_ROW_FLOWER_SIZE,
    height: FLOWER_LEDGER_ROW_FLOWER_SIZE,
  },
  flowerPlaceholder: {
    width: FLOWER_LEDGER_ROW_FLOWER_SIZE,
    height: FLOWER_LEDGER_ROW_FLOWER_SIZE,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
  },
  quantity: {
    minWidth: 28,
    fontSize: 14,
    color: MUTED_TEXT_COLOR,
  },
});
