import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { APP_TEXT_COLOR } from '@/constants/Colors';
import { ProfileEmptyPane } from '@/src/features/profile/components/ProfileEmptyPane';
import { PROFILE_ACCENT, PROFILE_MUTED } from '@/src/features/profile/constants';
import type {
  FlowerSentItem,
  ProfileAskItem,
  ProfileCommentItem,
  ProfileShareItem,
  ProfileStoryItem,
} from '@/src/features/profile/types';
import { AskCard } from '@/src/features/square/components/ask/AskCard';
import { StoryCard } from '@/src/features/square/components/StoryCard';
import { resolveCdnUrl } from '@/src/utils/cdn';

type ContentKind = 'stories' | 'shares' | 'asks' | 'comments' | 'flowersSent';

interface ProfileContentPaneProps {
  kind: ContentKind;
  items: Array<
    ProfileStoryItem | ProfileShareItem | ProfileAskItem | ProfileCommentItem | FlowerSentItem
  >;
  isLoading: boolean;
  isError: boolean;
  emptyMessage: string;
  hasNextPage?: boolean;
  onRetry: () => void;
  onLoadMore: () => void;
}

export function ProfileContentPane({
  kind,
  items,
  isLoading,
  isError,
  emptyMessage,
  hasNextPage,
  onRetry,
  onLoadMore,
}: ProfileContentPaneProps) {
  const router = useRouter();

  if (isLoading) {
    return <ActivityIndicator style={styles.status} color={PROFILE_ACCENT} />;
  }
  if (isError) {
    return (
      <View style={styles.status}>
        <Text style={styles.muted}>加载失败</Text>
        <Pressable onPress={onRetry}>
          <Text style={styles.retry}>重试</Text>
        </Pressable>
      </View>
    );
  }
  if (items.length === 0) {
    return <ProfileEmptyPane message={emptyMessage} />;
  }

  return (
    <View style={styles.list}>
      {kind === 'stories'
        ? (items as ProfileStoryItem[]).map((story) => (
            <View key={story.id} style={styles.cardWrap}>
              {story.isPinned ? <Text style={styles.pin}>置顶</Text> : null}
              <StoryCard story={story} onPress={(id) => router.push(`/stories/${id}`)} />
              <Text style={styles.meta}>阅读 {story.viewCount}</Text>
            </View>
          ))
        : null}
      {kind === 'shares'
        ? (items as ProfileShareItem[]).map((share) => (
            <View key={share.id} style={styles.simpleRow}>
              <Text style={styles.simpleBody} numberOfLines={3}>
                {share.content}
              </Text>
              <Text style={styles.muted}>阅读 {share.viewCount}</Text>
            </View>
          ))
        : null}
      {kind === 'asks'
        ? (items as ProfileAskItem[]).map((ask) => (
            <View key={ask.id} style={styles.cardWrap}>
              <AskCard ask={ask} onPress={(id) => router.push(`/asks/${id}`)} />
            </View>
          ))
        : null}
      {kind === 'comments'
        ? (items as ProfileCommentItem[]).map((item) => (
            <View key={item.id} style={styles.simpleRow}>
              <Text style={styles.simpleBody}>{item.content}</Text>
              <Text style={styles.muted}>{item.source.titleOrSummary}</Text>
            </View>
          ))
        : null}
      {kind === 'flowersSent'
        ? (items as FlowerSentItem[]).map((item) => {
            const uri = resolveCdnUrl(item.giftFlower.imagePath);
            return (
              <View key={item.id} style={styles.simpleRow}>
                <View style={styles.flowerRow}>
                  {uri ? (
                    <Image source={{ uri }} style={styles.thumb} contentFit="cover" />
                  ) : (
                    <View style={[styles.thumb, styles.thumbFallback]} />
                  )}
                  <View style={styles.flex}>
                    <Text style={styles.simpleBody}>
                      送给 {item.receiver.nickName} · {item.giftFlower.name} ×{item.quantity}
                    </Text>
                    {item.message ? <Text style={styles.muted}>{item.message}</Text> : null}
                  </View>
                </View>
              </View>
            );
          })
        : null}
      {hasNextPage ? (
        <Pressable style={styles.more} onPress={onLoadMore}>
          <Text style={styles.retry}>加载更多</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { paddingHorizontal: 12, paddingBottom: 24, gap: 10 },
  cardWrap: { gap: 4 },
  pin: {
    alignSelf: 'flex-start',
    fontSize: 11,
    fontWeight: '700',
    color: PROFILE_ACCENT,
    marginLeft: 4,
  },
  meta: { fontSize: 12, color: PROFILE_MUTED, marginLeft: 4 },
  simpleRow: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    gap: 4,
  },
  simpleBody: { fontSize: 14, color: APP_TEXT_COLOR, lineHeight: 20 },
  muted: { fontSize: 12, color: PROFILE_MUTED },
  flowerRow: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  thumb: { width: 40, height: 40, borderRadius: 8, backgroundColor: '#E2E8F0' },
  thumbFallback: { backgroundColor: '#CBD5E1' },
  flex: { flex: 1, gap: 2 },
  status: { paddingVertical: 40, alignItems: 'center', gap: 8 },
  retry: { fontSize: 14, fontWeight: '600', color: PROFILE_ACCENT },
  more: { alignItems: 'center', paddingVertical: 12 },
});
