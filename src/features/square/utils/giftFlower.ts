import type { GiftFlowerInventoryItem } from '@/src/features/square/types';

export function getGiftableInventoryItems(
  items: GiftFlowerInventoryItem[],
): GiftFlowerInventoryItem[] {
  return items.filter((item) => item.purchasedCount > 0);
}

export function getGiftFlowerCost(coinValue: number, quantity: number): number {
  return coinValue * quantity;
}
