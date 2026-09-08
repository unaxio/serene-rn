import * as Clipboard from 'expo-clipboard';

import {
  SHARE_SHEET_COPY_FAIL,
  SHARE_SHEET_COPY_SUCCESS,
} from '@/src/features/square/constants';
import { buildSquareShareUrl } from '@/src/features/square/utils/shareUrl';
import { showErrorToast, showToast } from '@/src/utils/toast';

export async function copySquareLink(path: string): Promise<void> {
  try {
    await Clipboard.setStringAsync(buildSquareShareUrl(path));
    showToast(SHARE_SHEET_COPY_SUCCESS);
  } catch {
    showErrorToast(SHARE_SHEET_COPY_FAIL);
  }
}
