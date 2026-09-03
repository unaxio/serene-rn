import { StyleSheet, Text, View } from 'react-native';

import { APP_TEXT_COLOR } from '@/constants/Colors';
import { FlowerQuantityStepper } from '@/src/features/square/components/FlowerQuantityStepper';
import { GiftFlowerGrid } from '@/src/features/square/components/giftFlower/GiftFlowerGrid';
import { GiftFlowerItemScroller } from '@/src/features/square/components/giftFlower/GiftFlowerItemScroller';
import { GiftFlowerPaneStatus } from '@/src/features/square/components/giftFlower/GiftFlowerPaneStatus';
import { GiftFlowerPrimaryButton } from '@/src/features/square/components/giftFlower/GiftFlowerPrimaryButton';
import { GiftFlowerTile } from '@/src/features/square/components/giftFlower/GiftFlowerTile';
import {
  DANGER_TEXT_COLOR,
  FLOWER_QUANTITY_MAX,
  FLOWER_QUANTITY_MIN,
  GIFT_FLOWER_COIN_LABEL,
  GIFT_FLOWER_PURCHASE_ACTION,
  MUTED_TEXT_COLOR,
} from '@/src/features/square/constants';
import type { GiftFlower } from '@/src/features/square/types';
import { getGiftFlowerCost } from '@/src/features/square/utils/giftFlower';

interface GiftFlowerShopPaneProps {
  items: GiftFlower[];
  flowerCoin: number;
  isLoading: boolean;
  isError: boolean;
  selectedId: string | null;
  quantity: number;
  isPurchasing: boolean;
  onRetry: () => void;
  onSelect: (giftFlowerId: string) => void;
  onQuantityChange: (quantity: number) => void;
  onPurchase: () => void;
}

export function GiftFlowerShopPane({
  items,
  flowerCoin,
  isLoading,
  isError,
  selectedId,
  quantity,
  isPurchasing,
  onRetry,
  onSelect,
  onQuantityChange,
  onPurchase,
}: GiftFlowerShopPaneProps) {
  const selected = items.find((item) => item.id === selectedId);
  const cost = selected ? getGiftFlowerCost(selected.coinValue, quantity) : 0;
  const canAfford = cost > 0 && cost <= flowerCoin;
  const canPurchase = Boolean(selected) && quantity >= FLOWER_QUANTITY_MIN && canAfford;

  return (
    <View style={styles.root}>
      <GiftFlowerItemScroller>
        <GiftFlowerPaneStatus
          isLoading={isLoading}
          isError={isError}
          isEmpty={!isLoading && !isError && items.length === 0}
          emptyText="暂无可购买的礼物花"
          errorText="商店加载失败"
          onRetry={onRetry}
        />
        {items.length > 0 ? (
          <GiftFlowerGrid>
            {items.map((item) => (
              <GiftFlowerTile
                key={item.id}
                name={item.name}
                imagePath={item.imagePath}
                badge={`${item.coinValue} ${GIFT_FLOWER_COIN_LABEL}`}
                selected={item.id === selectedId}
                onPress={() => onSelect(item.id)}
              />
            ))}
          </GiftFlowerGrid>
        ) : null}
      </GiftFlowerItemScroller>
      {selected ? (
        <View style={styles.footer}>
          <Text style={styles.selectedName}>{selected.name}</Text>
          <FlowerQuantityStepper
            quantity={quantity}
            max={FLOWER_QUANTITY_MAX}
            onChange={onQuantityChange}
          />
          <Text style={[styles.cost, !canAfford && styles.costWarn]}>
            花费 {cost} {GIFT_FLOWER_COIN_LABEL}
            {canAfford ? '' : '（余额不足）'}
          </Text>
          <GiftFlowerPrimaryButton
            label={GIFT_FLOWER_PURCHASE_ACTION}
            disabled={!canPurchase}
            loading={isPurchasing}
            onPress={onPurchase}
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
  footer: {
    gap: 12,
    paddingTop: 8,
  },
  selectedName: {
    textAlign: 'center',
    fontSize: 13,
    color: MUTED_TEXT_COLOR,
  },
  cost: {
    textAlign: 'center',
    fontSize: 13,
    color: APP_TEXT_COLOR,
  },
  costWarn: {
    color: DANGER_TEXT_COLOR,
  },
});
