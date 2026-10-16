import { Alert } from 'react-native';

import {
  GIFT_FLOWER_PURCHASE_CANCEL,
  GIFT_FLOWER_PURCHASE_CONFIRM,
  GIFT_FLOWER_PURCHASE_MESSAGE,
  GIFT_FLOWER_PURCHASE_TITLE,
} from '@/src/features/square/constants';

export function confirmPurchaseGiftFlower(): Promise<boolean> {
  return new Promise((resolve) => {
    Alert.alert(
      GIFT_FLOWER_PURCHASE_TITLE,
      GIFT_FLOWER_PURCHASE_MESSAGE,
      [
        { text: GIFT_FLOWER_PURCHASE_CANCEL, style: 'cancel', onPress: () => resolve(false) },
        { text: GIFT_FLOWER_PURCHASE_CONFIRM, onPress: () => resolve(true) },
      ],
      { cancelable: true, onDismiss: () => resolve(false) },
    );
  });
}
