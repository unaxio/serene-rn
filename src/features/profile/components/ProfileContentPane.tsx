import { useRouter } from 'expo-router';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { APP_TEXT_COLOR } from '@/constants/Colors';
import { ProfileCommentRow } from '@/src/features/profile/components/ProfileCommentRow';
import { ProfileEmptyPane } from '@/src/features/profile/components/ProfileEmptyPane';
import { ProfileFlowerSentRow } from '@/src/features/profile/components/ProfileFlowerSentRow';
import { ProfilePublishMoreAnchor } from '@/src/features/profile/components/ProfilePublishMoreAnchor';
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
  /** 分享列表点击后打开详情弹窗 */
  onPressShare?: (share: ProfileShareItem) => void;
  /** 「发布」下各类内容右上角肉串菜单 */
  showPublishMoreMenu?: boolean;
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
  onPressShare,
  showPublishMoreMenu = false,
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
              {showPublishMoreMenu ? (
                <View style={styles.moreCorner}>
                  <ProfilePublishMoreAnchor
                    contentKind="story"
                    targetId={story.id}
                    authorId={story.author.id}
                  />
                </View>
              ) : null}
              {story.isPinned ? <Text style={styles.pin}>置顶</Text> : null}
              <StoryCard story={story} onPress={(id) => router.push(`/stories/${id}`)} />
              <Text style={styles.meta}>阅读 {story.viewCount}</Text>
            </View>
          ))
        : null}
      {kind === 'shares'
        ? (items as ProfileShareItem[]).map((share) => {
            const body = (
              <>
                <Text style={styles.simpleBody} numberOfLines={3}>
                  {share.content}
                </Text>
                <Text style={styles.muted}>阅读 {share.viewCount}</Text>
              </>
            );
            const more = showPublishMoreMenu ? (
              <View style={styles.moreCorner}>
                <ProfilePublishMoreAnchor
                  contentKind="share"
                  targetId={share.id}
                  authorId={share.author.id}
                  shareSnapshot={share}
                />
              </View>
            ) : null;
            if (onPressShare) {
              return (
                <Pressable
                  key={share.id}
                  style={styles.simpleRow}
                  onPress={() => onPressShare(share)}>
                  {more}
                  {body}
                </Pressable>
              );
            }
            return (
              <View key={share.id} style={styles.simpleRow}>
                {more}
                {body}
              </View>
            );
          })
        : null}
      {kind === 'asks'
        ? (items as ProfileAskItem[]).map((ask) => (
            <View key={ask.id} style={styles.cardWrap}>
              {showPublishMoreMenu ? (
                <View style={styles.moreCorner}>
                  <ProfilePublishMoreAnchor
                    contentKind="ask"
                    targetId={ask.id}
                    authorId={ask.author.id}
                  />
                </View>
              ) : null}
              <AskCard ask={ask} onPress={(id) => router.push(`/asks/${id}`)} />
            </View>
          ))
        : null}
      {kind === 'comments'
        ? (items as ProfileCommentItem[]).map((item) => (
            <ProfileCommentRow key={item.id} item={item} />
          ))
        : null}
      {kind === 'flowersSent'
        ? (items as FlowerSentItem[]).map((item) => (
            <ProfileFlowerSentRow key={item.id} item={item} />
          ))
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
  cardWrap: { gap: 4, position: 'relative' },
  moreCorner: {
    position: 'absolute',
    top: 6,
    right: 6,
    zIndex: 2,
  },
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
    paddingRight: 36,
    gap: 4,
    position: 'relative',
  },
  simpleBody: { fontSize: 14, color: APP_TEXT_COLOR, lineHeight: 20 },
  muted: { fontSize: 12, color: PROFILE_MUTED },
  status: { paddingVertical: 40, alignItems: 'center', gap: 8 },
  retry: { fontSize: 14, fontWeight: '600', color: PROFILE_ACCENT },
  more: { alignItems: 'center', paddingVertical: 12 },
});
