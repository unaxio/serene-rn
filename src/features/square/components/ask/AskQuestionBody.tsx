import { StyleSheet, Text, View } from 'react-native';

import { APP_TEXT_COLOR } from '@/constants/Colors';
import { AskCtaButtons } from '@/src/features/square/components/ask/AskCtaButtons';
import { SquareUserAvatar } from '@/src/features/square/components/SquareUserAvatar';
import { TopicTag } from '@/src/features/square/components/TopicTag';
import { CommentActionButton } from '@/src/features/square/components/comments/CommentActionButton';
import {
  ASK_COLLECT_LABEL,
  MUTED_TEXT_COLOR,
} from '@/src/features/square/constants';
import type { Ask } from '@/src/features/square/types';
import {
  getAuthorDisplayName,
  getAuthorLevelLabel,
} from '@/src/features/square/utils/displayAuthor';
import { formatRelativeTime } from '@/src/features/square/utils/formatRelativeTime';

interface AskQuestionBodyProps {
  ask: Ask;
  onCollect: () => void;
  onAnswer: () => void;
  onInvite: () => void;
  onLayoutHeight: (height: number) => void;
}

const AUTHOR_AVATAR_SIZE = 40;

export function AskQuestionBody({
  ask,
  onCollect,
  onAnswer,
  onInvite,
  onLayoutHeight,
}: AskQuestionBodyProps) {
  return (
    <View
      style={styles.wrap}
      onLayout={(event) => {
        onLayoutHeight(event.nativeEvent.layout.height);
      }}>
      <View style={styles.authorRow}>
        <SquareUserAvatar author={ask.author} size={AUTHOR_AVATAR_SIZE} />
        <View style={styles.authorMeta}>
          <View style={styles.nameRow}>
            <Text style={styles.name} numberOfLines={1}>
              {getAuthorDisplayName(ask.author)}
            </Text>
            <TopicTag label={getAuthorLevelLabel(ask.author)} />
          </View>
          <Text style={styles.time}>{formatRelativeTime(ask.createdAt)}</Text>
        </View>
        {ask.topicTag ? <TopicTag label={ask.topicTag} /> : null}
      </View>
      <Text style={styles.title}>{ask.title}</Text>
      {ask.content.trim().length > 0 ? (
        <Text style={styles.content}>{ask.content}</Text>
      ) : null}
      <View style={styles.collectRow}>
        <CommentActionButton
          icon={{ ios: 'star', android: 'star_border', web: 'star_border' }}
          label={`${ASK_COLLECT_LABEL} ${ask.collectCount}`}
          active={ask.isCollected}
          onPress={onCollect}
        />
      </View>
      <AskCtaButtons onAnswer={onAnswer} onInvite={onInvite} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 12,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  authorMeta: {
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
    fontSize: 15,
    fontWeight: '600',
    color: APP_TEXT_COLOR,
  },
  time: {
    fontSize: 12,
    color: MUTED_TEXT_COLOR,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 30,
    color: APP_TEXT_COLOR,
  },
  content: {
    fontSize: 15,
    lineHeight: 24,
    color: APP_TEXT_COLOR,
  },
  collectRow: {
    flexDirection: 'row',
  },
});
