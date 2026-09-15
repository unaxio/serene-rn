import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { ProfileContentPane } from '@/src/features/profile/components/ProfileContentPane';
import { ProfileContentTabs } from '@/src/features/profile/components/ProfileContentTabs';
import { ProfileEmptyPane } from '@/src/features/profile/components/ProfileEmptyPane';
import { ProfileEntrySection } from '@/src/features/profile/components/ProfileEntrySection';
import { ProfileHomeHeader } from '@/src/features/profile/components/ProfileHomeHeader';
import { ProfileInfoCard } from '@/src/features/profile/components/ProfileInfoCard';
import { ProfileStatsBar } from '@/src/features/profile/components/ProfileStatsBar';
import { ProfileSubTabs } from '@/src/features/profile/components/ProfileSubTabs';
import {
  PROFILE_ACCENT,
  PROFILE_COLLECT_SUB_TABS,
  PROFILE_PAGE_BG,
  PROFILE_PUBLISH_SUB_TABS,
  PROFILE_RESONATE_SUB_TABS,
  type ProfileContentTabId,
} from '@/src/features/profile/constants';
import { useProfileContentList } from '@/src/features/profile/hooks/useProfileContentList';
import { useProfileHomeData } from '@/src/features/profile/hooks/useProfileHomeData';
import { useAuthStore } from '@/src/store/authStore';

const EMPTY_BY_TAB: Record<ProfileContentTabId, string> = {
  publish: '还没有发布内容',
  comment: '还没有发表评论',
  flower: '还没有送出花朵',
  collect: '还没有收藏',
  resonate: '还没有共鸣记录',
};

export function ProfileHomeScreen() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const { home, isLoading, isError, refetch } = useProfileHomeData(Boolean(user?.id));
  const [mainTab, setMainTab] = useState<ProfileContentTabId>('publish');
  const [publishSub, setPublishSub] = useState<'story' | 'share' | 'ask'>('story');
  const [collectSub, setCollectSub] = useState<'story' | 'ask' | 'comment'>('story');
  const [resonateSub, setResonateSub] = useState<'story' | 'ask' | 'share' | 'comment'>('story');
  const content = useProfileContentList({
    main: mainTab,
    publishSub,
    collectSub,
    resonateSub,
  });

  const openSettings = useCallback(() => {
    router.push('/profile/settings');
  }, [router]);

  const header = (
    <ProfileHomeHeader
      onPressNotifications={() => router.push('/profile/messages')}
      onPressSettings={openSettings}
    />
  );

  if (!user) {
    return (
      <View style={styles.root}>
        {header}
        <ProfileEmptyPane message="请先登录" />
      </View>
    );
  }

  if (isLoading && !home) {
    return (
      <View style={styles.root}>
        {header}
        <ActivityIndicator style={styles.loading} color={PROFILE_ACCENT} />
      </View>
    );
  }

  if ((isError && !home) || !home) {
    return (
      <View style={styles.root}>
        {header}
        <View style={styles.errorBox}>
          <ProfileEmptyPane message={isError ? '主页加载失败' : '暂无主页数据'} />
          {isError ? (
            <Pressable onPress={refetch}>
              <Text style={styles.retry}>重试</Text>
            </Pressable>
          ) : null}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      {header}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        stickyHeaderIndices={[4]}
        showsVerticalScrollIndicator={false}>
        <ProfileInfoCard
          profile={home.profile}
          onPressEdit={() => router.push('/profile/edit')}
        />
        <ProfileStatsBar
          stats={home.stats}
          onPressFollowing={() => router.push('/profile/following')}
          onPressFollowers={() => router.push('/profile/followers')}
          onPressLikes={() => router.push('/profile/likes')}
        />
        <ProfileEntrySection
          flowerCoin={home.flowerCoin}
          recentFlowers={home.recentReceivedFlowers}
          onPressMembership={() => router.push('/profile/membership')}
          onPressInventory={() => router.push('/profile/flower-inventory')}
          onPressReceivedAll={() => router.push('/profile/received-flowers')}
        />
        <View style={styles.gap} />
        <ProfileContentTabs activeId={mainTab} onChange={setMainTab} />
        {mainTab === 'publish' ? (
          <ProfileSubTabs
            options={PROFILE_PUBLISH_SUB_TABS}
            value={publishSub}
            onChange={setPublishSub}
          />
        ) : null}
        {mainTab === 'collect' ? (
          <ProfileSubTabs
            options={PROFILE_COLLECT_SUB_TABS}
            value={collectSub}
            onChange={setCollectSub}
          />
        ) : null}
        {mainTab === 'resonate' ? (
          <ProfileSubTabs
            options={PROFILE_RESONATE_SUB_TABS}
            value={resonateSub}
            onChange={setResonateSub}
          />
        ) : null}
        <ProfileContentPane
          kind={content.kind}
          items={content.items}
          isLoading={content.isLoading}
          isError={content.isError}
          emptyMessage={EMPTY_BY_TAB[mainTab]}
          hasNextPage={Boolean(content.hasNextPage)}
          onRetry={() => {
            void content.refetch();
          }}
          onLoadMore={content.loadMore}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: PROFILE_PAGE_BG },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 24 },
  gap: { height: 8 },
  loading: { marginTop: 80 },
  errorBox: { flex: 1, alignItems: 'center', gap: 8 },
  retry: { fontSize: 14, fontWeight: '600', color: PROFILE_ACCENT },
});
