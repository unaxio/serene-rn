import * as Clipboard from 'expo-clipboard';
import { Alert } from 'react-native';

import { showErrorToast, showToast } from '@/src/utils/toast';

export function showCommentActionMenu(content: string): void {
  Alert.alert('评论操作', undefined, [
    { text: '举报' },
    {
      text: '复制',
      onPress: () => {
        void copyCommentContent(content);
      },
    },
    { text: '取消', style: 'cancel' },
  ]);
}

async function copyCommentContent(content: string): Promise<void> {
  try {
    await Clipboard.setStringAsync(content);
    showToast('已复制');
  } catch {
    showErrorToast('复制失败');
  }
}
