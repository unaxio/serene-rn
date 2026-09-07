import * as Clipboard from 'expo-clipboard';
import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BottomSheetModal } from '@/src/components/BottomSheetModal';
import { APP_TEXT_COLOR } from '@/constants/Colors';
import {
  SHARE_SHEET_COPY_FAIL,
  SHARE_SHEET_COPY_LINK,
  SHARE_SHEET_COPY_SUCCESS,
} from '@/src/features/square/constants';
import { buildSquareShareUrl } from '@/src/features/square/utils/shareUrl';
import { showErrorToast, showToast } from '@/src/utils/toast';

interface SquareShareSheetProps {
  visible: boolean;
  path: string;
  onClose: () => void;
}

const HANDLE_WIDTH = 36;
const HANDLE_HEIGHT = 4;
const ICON_SIZE = 18;
const SHEET_MIN_BOTTOM = 12;
const SHEET_RADIUS = 16;

export function SquareShareSheet({ visible, path, onClose }: SquareShareSheetProps) {
  const insets = useSafeAreaInsets();

  const handleCopyLink = async () => {
    try {
      await Clipboard.setStringAsync(buildSquareShareUrl(path));
      showToast(SHARE_SHEET_COPY_SUCCESS);
      onClose();
    } catch {
      showErrorToast(SHARE_SHEET_COPY_FAIL);
    }
  };

  return (
    <BottomSheetModal visible={visible} onClose={onClose}>
      <View
        style={[
          styles.sheet,
          { paddingBottom: Math.max(insets.bottom, SHEET_MIN_BOTTOM) },
        ]}>
        <View style={styles.handle} />
        <Pressable style={styles.action} onPress={() => void handleCopyLink()}>
          <SymbolView
            name={{ ios: 'link', android: 'link', web: 'link' }}
            size={ICON_SIZE}
            tintColor={APP_TEXT_COLOR}
          />
          <Text style={styles.actionLabel}>{SHARE_SHEET_COPY_LINK}</Text>
        </Pressable>
      </View>
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: SHEET_RADIUS,
    borderTopRightRadius: SHEET_RADIUS,
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  handle: {
    alignSelf: 'center',
    width: HANDLE_WIDTH,
    height: HANDLE_HEIGHT,
    borderRadius: HANDLE_HEIGHT / 2,
    backgroundColor: '#E2E8F0',
    marginBottom: 8,
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
  },
  actionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: APP_TEXT_COLOR,
  },
});
