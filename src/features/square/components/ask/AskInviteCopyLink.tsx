import * as Clipboard from 'expo-clipboard';
import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { APP_TEXT_COLOR } from '@/constants/Colors';
import {
  ASK_INVITE_COPY_HINT,
  MUTED_TEXT_COLOR,
  SHARE_SHEET_COPY_FAIL,
  SHARE_SHEET_COPY_LINK,
  SHARE_SHEET_COPY_SUCCESS,
} from '@/src/features/square/constants';
import { buildSquareShareUrl } from '@/src/features/square/utils/shareUrl';
import { showErrorToast, showToast } from '@/src/utils/toast';

interface AskInviteCopyLinkProps {
  askId: string;
}

const LINK_ICON_SIZE = 18;

export function AskInviteCopyLink({ askId }: AskInviteCopyLinkProps) {
  const handleCopyLink = async () => {
    try {
      await Clipboard.setStringAsync(buildSquareShareUrl(`/asks/${askId}`));
      showToast(SHARE_SHEET_COPY_SUCCESS);
    } catch {
      showErrorToast(SHARE_SHEET_COPY_FAIL);
    }
  };

  return (
    <Pressable style={styles.row} onPress={() => void handleCopyLink()}>
      <SymbolView
        name={{ ios: 'link', android: 'link', web: 'link' }}
        size={LINK_ICON_SIZE}
        tintColor={APP_TEXT_COLOR}
      />
      <View style={styles.meta}>
        <Text style={styles.title}>{SHARE_SHEET_COPY_LINK}</Text>
        <Text style={styles.hint}>{ASK_INVITE_COPY_HINT}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
  },
  meta: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: APP_TEXT_COLOR,
  },
  hint: {
    fontSize: 12,
    color: MUTED_TEXT_COLOR,
  },
});
