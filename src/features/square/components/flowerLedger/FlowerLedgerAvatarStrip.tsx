import { useEffect, useState } from 'react';
import { StyleSheet, View, type LayoutChangeEvent } from 'react-native';

import { SquareUserAvatar } from '@/src/features/square/components/SquareUserAvatar';
import {
  FLOWER_LEDGER_AVATAR_GAP,
  FLOWER_LEDGER_AVATAR_SIZE,
} from '@/src/features/square/constants';
import type { GiftFlowerLedger } from '@/src/features/square/types';

interface FlowerLedgerAvatarStripProps {
  items: GiftFlowerLedger[];
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  loadMore: () => void;
}

function countFitSlots(width: number): number {
  if (width <= 0) {
    return 0;
  }
  return Math.floor(
    (width + FLOWER_LEDGER_AVATAR_GAP) /
      (FLOWER_LEDGER_AVATAR_SIZE + FLOWER_LEDGER_AVATAR_GAP),
  );
}

export function FlowerLedgerAvatarStrip({
  items,
  hasNextPage,
  isFetchingNextPage,
  loadMore,
}: FlowerLedgerAvatarStripProps) {
  const [slotCount, setSlotCount] = useState(0);

  const handleLayout = (event: LayoutChangeEvent) => {
    const next = countFitSlots(event.nativeEvent.layout.width);
    setSlotCount((prev) => (prev === next ? prev : next));
  };

  useEffect(() => {
    if (slotCount <= 0 || items.length >= slotCount) {
      return;
    }
    if (!hasNextPage || isFetchingNextPage) {
      return;
    }
    loadMore();
  }, [hasNextPage, isFetchingNextPage, items.length, loadMore, slotCount]);

  return (
    <View style={styles.strip} onLayout={handleLayout}>
      {items.slice(0, slotCount).map((item) => (
        <SquareUserAvatar
          key={item.id}
          author={item.sender}
          size={FLOWER_LEDGER_AVATAR_SIZE}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  strip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: FLOWER_LEDGER_AVATAR_GAP,
    overflow: 'hidden',
  },
});
