import type { FlowerCard } from '../types';

/**
 * 用 flowerId 在 full-data 的 flowerCards 中匹配当前花卡
 */
export function findFlowerCardById(
  flowerCards: FlowerCard[],
  flowerId?: string | null,
): FlowerCard | null {
  if (!flowerId) {
    return null;
  }
  return flowerCards.find((card) => card.id === flowerId) ?? null;
}
