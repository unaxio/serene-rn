import { StyleSheet, Text, View } from 'react-native';

import { FlowerQuantityStepper } from '@/src/features/square/components/FlowerQuantityStepper';
import { GiftFlowerGrid } from '@/src/features/square/components/giftFlower/GiftFlowerGrid';
import { GiftFlowerItemScroller } from '@/src/features/square/components/giftFlower/GiftFlowerItemScroller';
import { GiftFlowerPaneStatus } from '@/src/features/square/components/giftFlower/GiftFlowerPaneStatus';
import { GiftFlowerPrimaryButton } from '@/src/features/square/components/giftFlower/GiftFlowerPrimaryButton';
import { GiftFlowerTile } from '@/src/features/square/components/giftFlower/GiftFlowerTile';
import {
  FLOWER_QUANTITY_MAX,
  FLOWER_QUANTITY_MIN,
  GIFT_FLOWER_EMPTY_INVENTORY,
  GIFT_FLOWER_PURCHASE_ACTION,
  GIFT_FLOWER_RECEIVED_HINT,
  GIFT_FLOWER_SEND_ACTION,
  MUTED_TEXT_COLOR,
} from '@/src/features/square/constants';
import type { GiftFlowerInventoryItem } from '@/src/features/square/types';

interface GiftFlowerSendPaneProps {
  items: GiftFlowerInventoryItem[];
  hasReceivedOnly: boolean;
  isLoading: boolean;
  isError: boolean;
  selectedId: string | null;
  quantity: number;
  isSubmitting: boolean;
  onRetry: () => void;
  onSelect: (giftFlowerId: string) => void;
  onBuy: (giftFlowerId: string) => void;
  onQuantityChange: (quantity: number) => void;
  onSubmit: () => void;
}

export function GiftFlowerSendPane({
  items,
  hasReceivedOnly,
  isLoading,
  isError,
  selectedId,
  quantity,
  isSubmitting,
  onRetry,
  onSelect,
  onBuy,
  onQuantityChange,
  onSubmit,
}: GiftFlowerSendPaneProps) {
  const selected = items.find(
    (item) => item.giftFlowerId === selectedId && item.purchasedCount > 0,
  );
  const maxQuantity = Math.min(selected?.purchasedCount ?? FLOWER_QUANTITY_MIN, FLOWER_QUANTITY_MAX);
  const canSend = Boolean(selected) && quantity >= FLOWER_QUANTITY_MIN && quantity <= maxQuantity;

  return (
    <View style={styles.root}>
      <GiftFlowerItemScroller>
        <GiftFlowerPaneStatus
          isLoading={isLoading}
          isError={isError}
          isEmpty={!isLoading && !isError && items.length === 0}
          emptyText={GIFT_FLOWER_EMPTY_INVENTORY}
          errorText="花库加载失败"
          onRetry={onRetry}
        />
        {items.length > 0 ? (
          <GiftFlowerGrid>
            {items.map((item) => {
              const canGift = item.purchasedCount > 0;
              return (
                <GiftFlowerTile
                  key={item.giftFlowerId}
                  name={item.name}
                  imagePath={item.imagePath}
                  badge={canGift ? `可赠 ${item.purchasedCount}` : undefined}
                  actionLabel={canGift ? undefined : GIFT_FLOWER_PURCHASE_ACTION}
                  selected={canGift && item.giftFlowerId === selectedId}
                  onPress={() => {
                    if (canGift) {
                      onSelect(item.giftFlowerId);
                      return;
                    }
                    onBuy(item.giftFlowerId);
                  }}
                />
              );
            })}
          </GiftFlowerGrid>
        ) : null}
        {hasReceivedOnly ? <Text style={styles.hint}>{GIFT_FLOWER_RECEIVED_HINT}</Text> : null}
      </GiftFlowerItemScroller>
      {selected ? (
        <View style={styles.footer}>
          <Text style={styles.selectedName}>{selected.name}</Text>
          <FlowerQuantityStepper
            quantity={quantity}
            max={maxQuantity}
            onChange={onQuantityChange}
          />
          <GiftFlowerPrimaryButton
            label={GIFT_FLOWER_SEND_ACTION}
            disabled={!canSend}
            loading={isSubmitting}
            onPress={onSubmit}
          />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexShrink: 1,
  },
  hint: {
    textAlign: 'center',
    color: MUTED_TEXT_COLOR,
    fontSize: 12,
    paddingVertical: 8,
  },
  footer: {
    gap: 12,
    paddingTop: 8,
  },
  selectedName: {
    textAlign: 'center',
    fontSize: 13,
    color: MUTED_TEXT_COLOR,
  },
});
