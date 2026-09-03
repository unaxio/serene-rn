import { Image } from 'expo-image';
import { SymbolView } from 'expo-symbols';
import { memo, useCallback, type ComponentProps } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { APP_TEXT_COLOR } from '@/constants/Colors';
import { SquareUserAvatar } from '@/src/features/square/components/SquareUserAvatar';
import { TopicTag } from '@/src/features/square/components/TopicTag';
import { MUTED_TEXT_COLOR } from '@/src/features/square/constants';
import type { Story } from '@/src/features/square/types';
import { getAuthorDisplayName } from '@/src/features/square/utils/displayAuthor';
import { resolveCdnUrl } from '@/src/utils/cdn';

type SymbolName = ComponentProps<typeof SymbolView>['name'];

interface StoryCardProps {
  story: Story;
  onPress: (storyId: string) => void;
}

const COVER_SIZE = 72;
const META_ICON_SIZE = 14;

interface MetaItemProps {
  icon: SymbolName;
  count: number;
}

function MetaItem({ icon, count }: MetaItemProps) {
  return (
    <View style={styles.metaItem}>
      <SymbolView name={icon} size={META_ICON_SIZE} tintColor={MUTED_TEXT_COLOR} />
      <Text style={styles.metaText}>{count}</Text>
    </View>
  );
}

function StoryCardComponent({ story, onPress }: StoryCardProps) {
  const coverUri = resolveCdnUrl(story.coverImagePath);
  const handlePress = useCallback(() => {
    onPress(story.id);
  }, [onPress, story.id]);

  return (
    <Pressable style={styles.card} onPress={handlePress}>
      <View style={styles.authorRow}>
        <SquareUserAvatar author={story.author} size={24} />
        <Text style={styles.authorName} numberOfLines={1}>
          {getAuthorDisplayName(story.author)}
        </Text>
        {story.topicTag ? <TopicTag label={story.topicTag} /> : null}
      </View>
      <View style={styles.body}>
        <View style={styles.textCol}>
          <Text style={styles.title} numberOfLines={2}>
            {story.title}
          </Text>
          {story.summary ? (
            <Text style={styles.summary} numberOfLines={2}>
              {story.summary}
            </Text>
          ) : null}
        </View>
        {coverUri ? (
          <Image source={{ uri: coverUri }} style={styles.cover} contentFit="cover" />
        ) : null}
      </View>
      <View style={styles.metaRow}>
        <MetaItem
          icon={{ ios: 'heart', android: 'favorite_border', web: 'favorite_border' }}
          count={story.resonateCount}
        />
        <MetaItem
          icon={{ ios: 'bubble.left', android: 'chat_bubble_outline', web: 'chat_bubble_outline' }}
          count={story.commentCount}
        />
        <MetaItem
          icon={{ ios: 'leaf', android: 'local_florist', web: 'local_florist' }}
          count={story.flowerCount}
        />
      </View>
    </Pressable>
  );
}

export const StoryCard = memo(StoryCardComponent);

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EEEFF3',
    gap: 10,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  authorName: {
    flexShrink: 1,
    fontSize: 13,
    fontWeight: '500',
    color: APP_TEXT_COLOR,
  },
  body: {
    flexDirection: 'row',
    gap: 12,
  },
  textCol: {
    flex: 1,
    gap: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: APP_TEXT_COLOR,
    lineHeight: 22,
  },
  summary: {
    fontSize: 13,
    lineHeight: 18,
    color: MUTED_TEXT_COLOR,
  },
  cover: {
    width: COVER_SIZE,
    height: COVER_SIZE,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
  },
  metaRow: {
    flexDirection: 'row',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: MUTED_TEXT_COLOR,
  },
});
