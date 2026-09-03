import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BottomSheetModal } from '@/src/components/BottomSheetModal';
import { GiftFlowerCoinBar } from '@/src/features/square/components/giftFlower/GiftFlowerCoinBar';
import { GiftFlowerSendPane } from '@/src/features/square/components/giftFlower/GiftFlowerSendPane';
import { GiftFlowerSheetHeader } from '@/src/features/square/components/giftFlower/GiftFlowerSheetHeader';
import { GiftFlowerShopPane } from '@/src/features/square/components/giftFlower/GiftFlowerShopPane';
import {
  GIFT_FLOWER_SEND_SUCCESS,
  GIFT_FLOWER_SEND_TITLE,
  GIFT_FLOWER_SHOP_TITLE,
} from '@/src/features/square/constants';
import { useSendFlowerModal } from '@/src/features/square/hooks/useSendFlowerModal';
import { showToast } from '@/src/utils/toast';

interface SendFlowerModalProps {
  visible: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (giftFlowerId: string, quantity: number) => Promise<boolean>;
}

const SHEET_MAX_HEIGHT_RATIO = 0.82;
const SHEET_MIN_BOTTOM = 8;

export function SendFlowerModal({
  visible,
  isSubmitting,
  onClose,
  onSubmit,
}: SendFlowerModalProps) {
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();
  const modal = useSendFlowerModal(visible);
  const isShop = modal.pane === 'shop';
  const sheetMaxHeight = windowHeight * SHEET_MAX_HEIGHT_RATIO;

  const handleSend = async () => {
    if (!modal.sendSelectedId) {
      return;
    }
    const ok = await onSubmit(modal.sendSelectedId, modal.sendQuantity);
    if (ok) {
      showToast(GIFT_FLOWER_SEND_SUCCESS);
      onClose();
    }
  };

  return (
    <BottomSheetModal visible={visible} onClose={onClose}>
      <View
        style={[
          styles.sheet,
          {
            maxHeight: sheetMaxHeight,
            paddingBottom: Math.max(insets.bottom, SHEET_MIN_BOTTOM),
          },
        ]}>
        <GiftFlowerSheetHeader
          title={isShop ? GIFT_FLOWER_SHOP_TITLE : GIFT_FLOWER_SEND_TITLE}
          showBack={isShop}
          onBack={() => modal.setPane('inventory')}
          onClose={onClose}
        />
        {isShop ? (
          <GiftFlowerShopPane
            items={modal.catalog.items}
            flowerCoin={modal.inventory.flowerCoin}
            isLoading={modal.catalog.isLoading}
            isError={modal.catalog.isError}
            selectedId={modal.shopSelectedId}
            quantity={modal.shopQuantity}
            isPurchasing={modal.isPurchasing}
            onRetry={() => void modal.catalog.refetch()}
            onSelect={modal.handleSelectShop}
            onQuantityChange={modal.setShopQuantity}
            onPurchase={() => {
              void modal.handlePurchase();
            }}
          />
        ) : (
          <GiftFlowerSendPane
            giftableItems={modal.giftableItems}
            hasReceivedOnly={modal.hasReceivedOnly}
            isLoading={modal.inventory.isLoading}
            isError={modal.inventory.isError}
            selectedId={modal.sendSelectedId}
            quantity={modal.sendQuantity}
            isSubmitting={isSubmitting}
            onRetry={() => void modal.inventory.refetch()}
            onSelect={modal.handleSelectSend}
            onQuantityChange={modal.setSendQuantity}
            onSubmit={() => {
              void handleSend();
            }}
          />
        )}
        <GiftFlowerCoinBar
          flowerCoin={modal.inventory.flowerCoin}
          onAction={isShop ? undefined : () => modal.setPane('shop')}
        />
      </View>
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
});
