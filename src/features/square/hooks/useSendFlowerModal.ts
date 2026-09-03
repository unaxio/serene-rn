import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  FLOWER_QUANTITY_MAX,
  FLOWER_QUANTITY_MIN,
  GIFT_FLOWER_PURCHASE_SUCCESS,
} from '@/src/features/square/constants';
import { useGiftFlowerCatalog } from '@/src/features/square/hooks/useGiftFlowerCatalog';
import { useGiftFlowerInventory } from '@/src/features/square/hooks/useGiftFlowerInventory';
import { usePurchaseGiftFlower } from '@/src/features/square/hooks/usePurchaseGiftFlower';
import { getGiftableInventoryItems } from '@/src/features/square/utils/giftFlower';
import { showToast } from '@/src/utils/toast';

export type GiftFlowerPane = 'inventory' | 'shop';

export function useSendFlowerModal(visible: boolean) {
  const [pane, setPane] = useState<GiftFlowerPane>('inventory');
  const [sendSelectedId, setSendSelectedId] = useState<string | null>(null);
  const [shopSelectedId, setShopSelectedId] = useState<string | null>(null);
  const [sendQuantity, setSendQuantity] = useState(FLOWER_QUANTITY_MIN);
  const [shopQuantity, setShopQuantity] = useState(FLOWER_QUANTITY_MIN);
  const inventory = useGiftFlowerInventory(visible);
  const catalog = useGiftFlowerCatalog(visible && pane === 'shop');
  const { purchase, isPending: isPurchasing } = usePurchaseGiftFlower();

  const giftableItems = useMemo(
    () => getGiftableInventoryItems(inventory.items),
    [inventory.items],
  );
  const hasReceivedOnly = inventory.items.some(
    (item) => item.purchasedCount === 0 && item.receivedCount > 0,
  );

  useEffect(() => {
    if (!visible) {
      return;
    }
    setPane('inventory');
    setSendSelectedId(null);
    setShopSelectedId(null);
    setSendQuantity(FLOWER_QUANTITY_MIN);
    setShopQuantity(FLOWER_QUANTITY_MIN);
  }, [visible]);

  useEffect(() => {
    if (sendSelectedId) {
      return;
    }
    const first = giftableItems[0];
    if (first) {
      setSendSelectedId(first.giftFlowerId);
    }
  }, [giftableItems, sendSelectedId]);

  useEffect(() => {
    if (shopSelectedId) {
      return;
    }
    const first = catalog.items[0];
    if (first) {
      setShopSelectedId(first.id);
    }
  }, [catalog.items, shopSelectedId]);

  const handleSelectSend = useCallback((giftFlowerId: string) => {
    setSendSelectedId(giftFlowerId);
    setSendQuantity(FLOWER_QUANTITY_MIN);
  }, []);

  const handleSelectShop = useCallback((giftFlowerId: string) => {
    setShopSelectedId(giftFlowerId);
    setShopQuantity(FLOWER_QUANTITY_MIN);
  }, []);

  const handlePurchase = useCallback(async () => {
    if (!shopSelectedId) {
      return;
    }
    const result = await purchase(shopSelectedId, shopQuantity);
    if (!result) {
      return;
    }
    showToast(GIFT_FLOWER_PURCHASE_SUCCESS);
    setPane('inventory');
    setSendSelectedId(shopSelectedId);
    setSendQuantity(FLOWER_QUANTITY_MIN);
  }, [purchase, shopQuantity, shopSelectedId]);

  const selectedSend = giftableItems.find((item) => item.giftFlowerId === sendSelectedId);
  const sendMax = Math.min(
    selectedSend?.purchasedCount ?? FLOWER_QUANTITY_MIN,
    FLOWER_QUANTITY_MAX,
  );

  return {
    pane,
    setPane,
    inventory,
    catalog,
    giftableItems,
    hasReceivedOnly,
    sendSelectedId,
    shopSelectedId,
    sendQuantity: Math.min(sendQuantity, sendMax),
    shopQuantity,
    setSendQuantity,
    setShopQuantity,
    isPurchasing,
    handleSelectSend,
    handleSelectShop,
    handlePurchase,
  };
}
