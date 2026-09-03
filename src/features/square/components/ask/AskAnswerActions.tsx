import { CommentActionButton } from '@/src/features/square/components/comments/CommentActionButton';
import { StyleSheet, View } from 'react-native';

import { ASK_SHARE_LABEL } from '@/src/features/square/constants';
import type { AskAnswer } from '@/src/features/square/types';

interface AskAnswerActionsProps {
  answer: AskAnswer;
  onResonate: () => void;
  onCollect: () => void;
  onFlower: () => void;
  onComment: () => void;
  onShare: () => void;
}

export function AskAnswerActions({
  answer,
  onResonate,
  onCollect,
  onFlower,
  onComment,
  onShare,
}: AskAnswerActionsProps) {
  return (
    <View style={styles.row}>
      <CommentActionButton
        icon={{ ios: 'heart', android: 'favorite_border', web: 'favorite_border' }}
        label={String(answer.resonateCount)}
        active={answer.isResonated}
        onPress={onResonate}
      />
      <CommentActionButton
        icon={{ ios: 'star', android: 'star_border', web: 'star_border' }}
        label={String(answer.collectCount)}
        active={answer.isCollected}
        onPress={onCollect}
      />
      <CommentActionButton
        icon={{ ios: 'leaf', android: 'local_florist', web: 'local_florist' }}
        label={String(answer.flowerCount)}
        active={answer.isFlowered}
        onPress={onFlower}
      />
      <CommentActionButton
        icon={{ ios: 'bubble.left', android: 'chat_bubble_outline', web: 'chat_bubble_outline' }}
        label={String(answer.commentCount)}
        onPress={onComment}
      />
      <CommentActionButton
        icon={{ ios: 'square.and.arrow.up', android: 'share', web: 'share' }}
        label={ASK_SHARE_LABEL}
        onPress={onShare}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
});
