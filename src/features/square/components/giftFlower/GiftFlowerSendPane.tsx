import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { FlowerQuantityStepper } from '@/src/features/square/components/FlowerQuantityStepper';
import { GiftFlowerGrid } from '@/src/features/square/components/giftFlower/GiftFlowerGrid';
import { GiftFlowerPaneStatus } from '@/src/features/square/components/giftFlower/GiftFlowerPaneStatus';
import { GiftFlowerPrimaryButton } from '@/src/features/square/components/giftFlower/GiftFlowerPrimaryButton';
import { GiftFlowerTile } from '@/src/features/square/components/giftFlower/GiftFlowerTile';
import {
  FLOWER_QUANTITY_MAX,
  FLOWER_QUANTITY_MIN,
  GIFT_FLOWER_EMPTY_INVENTORY,
  GIFT_FLOWER_GRID_MAX_HEIGHT,
  GIFT_FLOWER_RECEIVED_HINT,
  GIFT_FLOWER_SEND_ACTION,
  MUTED_TEXT_COLOR,
} from '@/src/features/square/constants';
import type { GiftFlowerInventoryItem } from '@/src/features/square/types';

interface GiftFlowerSendPaneProps {
  giftableItems: GiftFlowerInventoryItem[];
  hasReceivedOnly: boolean;
  isLoading: boolean;
  isError: boolean;
  selectedId: string | null;
  quantity: number;
  isSubmitting: boolean;
  onRetry: () => void;
  onSelect: (giftFlowerId: string) => void;
  onQuantityChange: (quantity: number) => void;
  onSubmit: () => void;
}

export function GiftFlowerSendPane({
  giftableItems,
  hasReceivedOnly,
  isLoading,
  isError,
  selectedId,
  quantity,
  isSubmitting,
  onRetry,
  onSelect,
  onQuantityChange,
  onSubmit,
}: GiftFlowerSendPaneProps) {
  const selected = giftableItems.find((item) => item.giftFlowerId === selectedId);
  const maxQuantity = Math.min(selected?.purchasedCount ?? FLOWER_QUANTITY_MIN, FLOWER_QUANTITY_MAX);
  const canSend = Boolean(selected) && quantity >= FLOWER_QUANTITY_MIN && quantity <= maxQuantity;

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled">
        <GiftFlowerPaneStatus
          isLoading={isLoading}
          isError={isError}
          isEmpty={!isLoading && !isError && giftableItems.length === 0}
          emptyText={GIFT_FLOWER_EMPTY_INVENTORY}
          errorText="花库加载失败"
          onRetry={onRetry}
        />
        {giftableItems.length > 0 ? (
          <GiftFlowerGrid>
            {giftableItems.map((item) => (
              <GiftFlowerTile
                key={item.giftFlowerId}
                name={item.name}
                imagePath={item.imagePath}
                badge={`可赠 ${item.purchasedCount}`}
                selected={item.giftFlowerId === selectedId}
                onPress={() => onSelect(item.giftFlowerId)}
              />
            ))}
          </GiftFlowerGrid>
        ) : null}
        {hasReceivedOnly ? <Text style={styles.hint}>{GIFT_FLOWER_RECEIVED_HINT}</Text> : null}
      </ScrollView>
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
  scrollView: {
    maxHeight: GIFT_FLOWER_GRID_MAX_HEIGHT,
  },
  scroll: {
    paddingBottom: 8,
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
