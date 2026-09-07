import { Image } from 'expo-image';
import { memo, useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { APP_TEXT_COLOR } from '@/constants/Colors';
import { SquareUserAvatar } from '@/src/features/square/components/SquareUserAvatar';
import { TopicTag } from '@/src/features/square/components/TopicTag';
import {
  MUTED_TEXT_COLOR,
  PAGE_SURFACE_COLOR,
  SEARCH_BAR_BG,
  SEARCH_CONTENT_MAX_LINES,
  SEARCH_TITLE_MAX_LINES,
  SEARCH_TYPE_LABELS,
} from '@/src/features/square/constants';
import type { SquareSearchItem } from '@/src/features/square/types';
import { getAuthorDisplayName } from '@/src/features/square/utils/displayAuthor';
import { formatRelativeTime } from '@/src/features/square/utils/formatRelativeTime';
import { resolveCdnUrl } from '@/src/utils/cdn';

interface SquareSearchResultItemProps {
  item: SquareSearchItem;
  onPress: (item: SquareSearchItem) => void;
}

const AVATAR_SIZE = 28;
const COVER_ASPECT_RATIO = 16 / 9;

function SquareSearchResultItemInner({ item, onPress }: SquareSearchResultItemProps) {
  const coverUri = resolveCdnUrl(item.coverImage);
  const handlePress = useCallback(() => {
    onPress(item);
  }, [item, onPress]);

  return (
    <Pressable style={styles.card} onPress={handlePress}>
      <View style={styles.meta}>
        <TopicTag label={SEARCH_TYPE_LABELS[item.type]} />
        <Text style={styles.time}>{formatRelativeTime(item.createdAt)}</Text>
      </View>
      {item.title.trim().length > 0 ? (
        <Text style={styles.title} numberOfLines={SEARCH_TITLE_MAX_LINES}>
          {item.title}
        </Text>
      ) : null}
      {item.content.trim().length > 0 ? (
        <Text style={styles.content} numberOfLines={SEARCH_CONTENT_MAX_LINES}>
          {item.content}
        </Text>
      ) : null}
      {coverUri ? (
        <Image source={{ uri: coverUri }} style={styles.cover} contentFit="cover" />
      ) : null}
      <View style={styles.author}>
        <SquareUserAvatar author={item.author} size={AVATAR_SIZE} />
        <Text style={styles.authorName} numberOfLines={1}>
          {getAuthorDisplayName(item.author)}
        </Text>
      </View>
    </Pressable>
  );
}

export const SquareSearchResultItem = memo(SquareSearchResultItemInner);

const styles = StyleSheet.create({
  card: {
    backgroundColor: PAGE_SURFACE_COLOR,
    borderRadius: 12,
    padding: 12,
    gap: 8,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  time: {
    fontSize: 12,
    color: MUTED_TEXT_COLOR,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
    color: APP_TEXT_COLOR,
  },
  content: {
    fontSize: 13,
    lineHeight: 19,
    color: MUTED_TEXT_COLOR,
  },
  cover: {
    width: '100%',
    aspectRatio: COVER_ASPECT_RATIO,
    borderRadius: 8,
    backgroundColor: SEARCH_BAR_BG,
  },
  author: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  authorName: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: APP_TEXT_COLOR,
  },
});
