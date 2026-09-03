import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

import { APP_TEXT_COLOR } from '@/constants/Colors';
import { SquareUserAvatar } from '@/src/features/square/components/SquareUserAvatar';
import { TopicTag } from '@/src/features/square/components/TopicTag';
import { MUTED_TEXT_COLOR } from '@/src/features/square/constants';
import type { Story } from '@/src/features/square/types';
import { getAuthorDisplayName } from '@/src/features/square/utils/displayAuthor';
import { formatRelativeTime } from '@/src/features/square/utils/formatRelativeTime';
import { resolveCdnUrl } from '@/src/utils/cdn';

interface StoryDetailBodyProps {
  story: Story;
}

const COVER_HEIGHT = 220;

export function StoryDetailBody({ story }: StoryDetailBodyProps) {
  const coverUri = resolveCdnUrl(story.coverImagePath);

  return (
    <View style={styles.content}>
      <Text style={styles.title}>{story.title}</Text>
      <View style={styles.authorRow}>
        <SquareUserAvatar author={story.author} size={36} />
        <View style={styles.authorMeta}>
          <Text style={styles.authorName}>{getAuthorDisplayName(story.author)}</Text>
          <Text style={styles.time}>{formatRelativeTime(story.createdAt)}</Text>
        </View>
        {story.topicTag ? <TopicTag label={story.topicTag} /> : null}
      </View>
      {coverUri ? (
        <Image source={{ uri: coverUri }} style={styles.cover} contentFit="cover" />
      ) : null}
      <Text style={styles.body}>{story.content}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 14,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: APP_TEXT_COLOR,
    lineHeight: 32,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  authorMeta: {
    flex: 1,
    gap: 2,
  },
  authorName: {
    fontSize: 14,
    fontWeight: '600',
    color: APP_TEXT_COLOR,
  },
  time: {
    fontSize: 12,
    color: MUTED_TEXT_COLOR,
  },
  cover: {
    width: '100%',
    height: COVER_HEIGHT,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
  },
  body: {
    fontSize: 16,
    lineHeight: 26,
    color: APP_TEXT_COLOR,
  },
});
