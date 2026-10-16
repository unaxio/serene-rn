import { Alert } from 'react-native';

import {
  CONNECT_DELETE_CANCEL,
  CONNECT_DELETE_CONFIRM,
  CONNECT_DELETE_MESSAGE,
  CONNECT_DELETE_TITLE,
} from '@/src/features/connect/constants';

export function confirmDeleteConversation(): Promise<boolean> {
  return new Promise((resolve) => {
    Alert.alert(
      CONNECT_DELETE_TITLE,
      CONNECT_DELETE_MESSAGE,
      [
        { text: CONNECT_DELETE_CANCEL, style: 'cancel', onPress: () => resolve(false) },
        { text: CONNECT_DELETE_CONFIRM, style: 'destructive', onPress: () => resolve(true) },
      ],
      { cancelable: true, onDismiss: () => resolve(false) },
    );
  });
}
