import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { APP_TEXT_COLOR } from '@/constants/Colors';
import { AskAnswerActions } from '@/src/features/square/components/ask/AskAnswerActions';
import { SquareUserAvatar } from '@/src/features/square/components/SquareUserAvatar';
import { TopicTag } from '@/src/features/square/components/TopicTag';
import {
  ASK_ANSWER_CONTENT_TOP_GAP,
  ASK_ANSWER_LIST_GAP,
  MUTED_TEXT_COLOR,
} from '@/src/features/square/constants';
import type { AskAnswer } from '@/src/features/square/types';
import {
  getAuthorDisplayName,
  getAuthorLevelLabel,
} from '@/src/features/square/utils/displayAuthor';
import { formatRelativeTime } from '@/src/features/square/utils/formatRelativeTime';

interface AskAnswerItemProps {
  answer: AskAnswer;
  onPress?: () => void;
  onResonate: (answerId: string) => void;
  onCollect: (answerId: string) => void;
  onFlower: (answer: AskAnswer) => void;
  onComment: (answer: AskAnswer) => void;
  onShare: () => void;
}

const AVATAR_SIZE = 40;

function AskAnswerItemInner({
  answer,
  onPress,
  onResonate,
  onCollect,
  onFlower,
  onComment,
  onShare,
}: AskAnswerItemProps) {
  return (
    <View style={styles.item}>
      <Pressable onPress={onPress} disabled={!onPress}>
        <View style={styles.header}>
          <SquareUserAvatar author={answer.author} size={AVATAR_SIZE} />
          <View style={styles.meta}>
            <View style={styles.nameRow}>
              <Text style={styles.name} numberOfLines={1}>
                {getAuthorDisplayName(answer.author)}
              </Text>
              <TopicTag label={getAuthorLevelLabel(answer.author)} />
            </View>
            <Text style={styles.time}>{formatRelativeTime(answer.createdAt)}</Text>
          </View>
        </View>
        <Text style={styles.content}>{answer.content}</Text>
      </Pressable>
      <AskAnswerActions
        answer={answer}
        onResonate={() => onResonate(answer.id)}
        onCollect={() => onCollect(answer.id)}
        onFlower={() => onFlower(answer)}
        onComment={() => onComment(answer)}
        onShare={onShare}
      />
    </View>
  );
}

export const AskAnswerItem = memo(AskAnswerItemInner);

const styles = StyleSheet.create({
  item: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 10,
    marginBottom: ASK_ANSWER_LIST_GAP,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  meta: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  name: {
    flexShrink: 1,
    fontSize: 14,
    fontWeight: '600',
    color: APP_TEXT_COLOR,
  },
  time: {
    fontSize: 12,
    color: MUTED_TEXT_COLOR,
  },
  content: {
    marginTop: ASK_ANSWER_CONTENT_TOP_GAP,
    fontSize: 15,
    lineHeight: 24,
    color: APP_TEXT_COLOR,
  },
});
