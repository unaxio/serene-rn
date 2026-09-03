import { Image } from 'expo-image';
import { memo, useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { APP_TEXT_COLOR } from '@/constants/Colors';
import { SquareUserAvatar } from '@/src/features/square/components/SquareUserAvatar';
import { StoryCardStats } from '@/src/features/square/components/StoryCardStats';
import { TopicTag } from '@/src/features/square/components/TopicTag';
import { MUTED_TEXT_COLOR } from '@/src/features/square/constants';
import type { Story } from '@/src/features/square/types';
import { getAuthorDisplayName } from '@/src/features/square/utils/displayAuthor';
import { resolveCdnUrl } from '@/src/utils/cdn';

interface StoryCardProps {
  story: Story;
  onPress: (storyId: string) => void;
}

const AVATAR_SIZE = 36;
const TITLE_MAX_LINES = 2;
const BODY_MAX_LINES = 3;
const COVER_ASPECT_RATIO = 3 / 1;

function StoryCardComponent({ story, onPress }: StoryCardProps) {
  const coverUri = resolveCdnUrl(story.coverImagePath);
  const handlePress = useCallback(() => {
    onPress(story.id);
  }, [onPress, story.id]);
  const levelLabel = story.author.level == null ? null : `Lv.${story.author.level}`;

  return (
    <Pressable style={styles.card} onPress={handlePress}>
      <View style={styles.header}>
        <SquareUserAvatar author={story.author} size={AVATAR_SIZE} />
        <View style={styles.headerText}>
          <View style={styles.nameRow}>
            <Text style={styles.authorName} numberOfLines={1}>
              {getAuthorDisplayName(story.author)}
            </Text>
            {levelLabel ? <Text style={styles.level}>{levelLabel}</Text> : null}
          </View>
          {story.tags.length > 0 ? (
            <View style={styles.tags}>
              {story.tags.map((tag) => (
                <TopicTag key={tag} label={tag} />
              ))}
            </View>
          ) : null}
        </View>
      </View>
      <Text style={styles.title} numberOfLines={TITLE_MAX_LINES}>
        {story.title}
      </Text>
      {story.content ? (
        <Text style={styles.body} numberOfLines={BODY_MAX_LINES}>
          {story.content}
        </Text>
      ) : null}
      {coverUri ? (
        <Image source={{ uri: coverUri }} style={styles.cover} contentFit="cover" />
      ) : null}
      <StoryCardStats
        resonateCount={story.resonateCount}
        commentCount={story.commentCount}
        flowerCount={story.flowerCount}
      />
    </Pressable>
  );
}

export const StoryCard = memo(StoryCardComponent);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 10,
    gap: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerText: {
    flex: 1,
    gap: 4,
    minWidth: 0,
    justifyContent: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  authorName: {
    flexShrink: 1,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
    color: APP_TEXT_COLOR,
  },
  level: {
    fontSize: 10,
    fontWeight: '600',
    color: MUTED_TEXT_COLOR,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: APP_TEXT_COLOR,
    lineHeight: 20,
  },
  body: {
    fontSize: 12,
    lineHeight: 17,
    color: MUTED_TEXT_COLOR,
  },
  cover: {
    width: '100%',
    aspectRatio: COVER_ASPECT_RATIO,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
  },
});
