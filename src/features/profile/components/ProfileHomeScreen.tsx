import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { ProfileContentPane } from '@/src/features/profile/components/ProfileContentPane';
import { ProfileContentTabs } from '@/src/features/profile/components/ProfileContentTabs';
import { ProfileEntrySection } from '@/src/features/profile/components/ProfileEntrySection';
import { ProfileHomeGate } from '@/src/features/profile/components/ProfileHomeGate';
import { ProfileHomeHeader } from '@/src/features/profile/components/ProfileHomeHeader';
import { ProfileHomeSubTabs } from '@/src/features/profile/components/ProfileHomeSubTabs';
import { ProfileInfoCard } from '@/src/features/profile/components/ProfileInfoCard';
import { ProfileShareDetailModal } from '@/src/features/profile/components/ProfileShareDetailModal';
import { ProfileStatsBar } from '@/src/features/profile/components/ProfileStatsBar';
import {
  PROFILE_EMPTY_BY_TAB,
  PROFILE_PAGE_BG,
  type FlowerSentFilterId,
  type ProfileContentTabId,
} from '@/src/features/profile/constants';
import { useProfileContentList } from '@/src/features/profile/hooks/useProfileContentList';
import { useProfileHomeData } from '@/src/features/profile/hooks/useProfileHomeData';
import type { ProfileShareItem } from '@/src/features/profile/types';
import { useAuthStore } from '@/src/store/authStore';

export function ProfileHomeScreen() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const { home, isLoading, isError, refetch } = useProfileHomeData(Boolean(user?.id));
  const [mainTab, setMainTab] = useState<ProfileContentTabId>('publish');
  const [publishSub, setPublishSub] = useState<'story' | 'share' | 'ask'>('story');
  const [collectSub, setCollectSub] = useState<'story' | 'ask' | 'comment'>('story');
  const [resonateSub, setResonateSub] = useState<'story' | 'ask' | 'share' | 'comment'>('story');
  const [flowerSub, setFlowerSub] = useState<FlowerSentFilterId>('all');
  const [detailShare, setDetailShare] = useState<ProfileShareItem | null>(null);
  const content = useProfileContentList({
    main: mainTab,
    publishSub,
    collectSub,
    resonateSub,
    flowerSub,
  });

  const openSettings = useCallback(() => {
    router.push('/profile/settings');
  }, [router]);

  const handlePressShare = useCallback((share: ProfileShareItem) => {
    setDetailShare(share);
  }, []);

  const header = (
    <ProfileHomeHeader onPressSettings={openSettings} />
  );

  if (!user) {
    return <ProfileHomeGate header={header} message="请先登录" />;
  }

  if (isLoading && !home) {
    return <ProfileHomeGate header={header} loading />;
  }

  if ((isError && !home) || !home) {
    return (
      <ProfileHomeGate
        header={header}
        message={isError ? '主页加载失败' : '暂无主页数据'}
        onRetry={isError ? refetch : undefined}
      />
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
        <ProfileHomeSubTabs
          mainTab={mainTab}
          publishSub={publishSub}
          collectSub={collectSub}
          resonateSub={resonateSub}
          flowerSub={flowerSub}
          onPublishSub={setPublishSub}
          onCollectSub={setCollectSub}
          onResonateSub={setResonateSub}
          onFlowerSub={setFlowerSub}
        />
        <ProfileContentPane
          kind={content.kind}
          items={content.items}
          isLoading={content.isLoading}
          isError={content.isError}
          emptyMessage={PROFILE_EMPTY_BY_TAB[mainTab]}
          hasNextPage={Boolean(content.hasNextPage)}
          onRetry={() => {
            void content.refetch();
          }}
          onLoadMore={content.loadMore}
          onPressShare={content.kind === 'shares' ? handlePressShare : undefined}
          showPublishMoreMenu={mainTab === 'publish'}
        />
      </ScrollView>
      <ProfileShareDetailModal
        share={detailShare}
        visible={detailShare !== null}
        onClose={() => setDetailShare(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: PROFILE_PAGE_BG },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 24 },
  gap: { height: 8 },
});
