import { useRouter } from 'expo-router';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ProfileContentPane } from '@/src/features/profile/components/ProfileContentPane';
import { ProfileEmptyPane } from '@/src/features/profile/components/ProfileEmptyPane';
import { ProfileInfoCard } from '@/src/features/profile/components/ProfileInfoCard';
import { ProfileStatsBar } from '@/src/features/profile/components/ProfileStatsBar';
import { ProfileSubTabs } from '@/src/features/profile/components/ProfileSubTabs';
import { UserProfileFooter } from '@/src/features/profile/components/UserProfileFooter';
import {
  PROFILE_ACCENT,
  PROFILE_MUTED,
  PROFILE_PAGE_BG,
  PROFILE_PUBLISH_SUB_TABS,
  PROFILE_SURFACE,
} from '@/src/features/profile/constants';
import { useUserProfileActions } from '@/src/features/profile/hooks/useUserProfileActions';
import {
  getFollowActionLabel,
  isFollowActionPrimary,
  shouldFollowNext,
} from '@/src/features/profile/utils/followActionLabel';
import { SendFlowerModal } from '@/src/features/square/components/SendFlowerModal';
import { SquarePageHeader } from '@/src/features/square/components/SquarePageHeader';
import { COMING_SOON_MESSAGE } from '@/src/features/square/constants';
import { showToast } from '@/src/utils/toast';

interface UserProfileScreenProps {
  userId: string;
}

export function UserProfileScreen({ userId }: UserProfileScreenProps) {
  const router = useRouter();
  const {
    homeQuery,
    home,
    blocked,
    contentType,
    setContentType,
    apiType,
    contents,
    followMutation,
    flowerOpen,
    setFlowerOpen,
    isFlowerPending,
    handleSendFlower,
  } = useUserProfileActions(userId);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <SquarePageHeader title="用户主页" onBack={() => router.back()} />
      {homeQuery.isLoading ? (
        <ActivityIndicator style={styles.loading} color={PROFILE_ACCENT} />
      ) : homeQuery.isError || !home ? (
        <ProfileEmptyPane message="主页加载失败" />
      ) : blocked ? (
        <ProfileEmptyPane
          message={home.isBlockedMe ? '对方已将你拉黑' : '你已拉黑该用户'}
        />
      ) : (
        <>
          <ScrollView contentContainerStyle={styles.scroll}>
            <ProfileInfoCard profile={home.profile} />
            <ProfileStatsBar stats={home.stats} />
            <Pressable style={styles.garden} onPress={() => showToast(COMING_SOON_MESSAGE)}>
              <Text style={styles.gardenText}>TA的花园</Text>
              <Text style={styles.gardenSub}>功能开发中</Text>
            </Pressable>
            <ProfileSubTabs
              options={PROFILE_PUBLISH_SUB_TABS}
              value={contentType}
              onChange={setContentType}
            />
            <ProfileContentPane
              kind={apiType}
              items={contents.items}
              isLoading={contents.isLoading}
              isError={contents.isError}
              emptyMessage="暂无公开内容"
              hasNextPage={Boolean(contents.hasNextPage)}
              onRetry={() => {
                void contents.refetch();
              }}
              onLoadMore={contents.loadMore}
            />
          </ScrollView>
          <UserProfileFooter
            followLabel={getFollowActionLabel(home.relation)}
            followPrimary={isFollowActionPrimary(home.relation)}
            followDisabled={followMutation.isPending}
            onFollow={() => {
              void followMutation.mutateAsync(shouldFollowNext(home.relation));
            }}
            onMessage={() => showToast(COMING_SOON_MESSAGE)}
            onFlower={() => setFlowerOpen(true)}
          />
        </>
      )}
      <SendFlowerModal
        visible={flowerOpen}
        isSubmitting={isFlowerPending}
        onClose={() => setFlowerOpen(false)}
        onSubmit={handleSendFlower}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: PROFILE_PAGE_BG },
  loading: { marginTop: 40 },
  scroll: { paddingBottom: 16 },
  garden: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 8,
    padding: 16,
    borderRadius: 12,
    backgroundColor: PROFILE_SURFACE,
    gap: 4,
  },
  gardenText: { fontSize: 15, fontWeight: '600', color: '#0F172A' },
  gardenSub: { fontSize: 12, color: PROFILE_MUTED },
});
