import { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { DuoMemberCard } from '@/src/features/soulFlower/components/DuoMemberCard';
import { DuoStreakHero } from '@/src/features/soulFlower/components/DuoStreakHero';
import { LightCardBanner } from '@/src/features/soulFlower/components/LightCardBanner';
import { PersonalCheckInCalendar } from '@/src/features/soulFlower/components/PersonalCheckInCalendar';
import { useCheckInRecords } from '@/src/features/soulFlower/hooks/useCheckInRecords';
import { useMindMap } from '@/src/features/soulFlower/hooks/useMindMap';
import type { PartnerStatusResponse } from '@/src/features/soulFlower/types';
import {
  calcCurrentStreakDays,
  countUsagesInYearMonth,
  toYearMonth,
} from '@/src/features/soulFlower/utils/checkInCalendar';
import {
  getLocalTodayDateKey,
  intersectSets,
  toUsageDateKeySet,
  unionSets,
} from '@/src/features/soulFlower/utils/jointCheckIn';
import { useAuthStore } from '@/src/store/authStore';

interface DuoCheckInPanelProps {
  partnerStatus?: PartnerStatusResponse;
  enabled: boolean;
}

export function DuoCheckInPanel({
  partnerStatus,
  enabled,
}: DuoCheckInPanelProps) {
  const user = useAuthStore((state) => state.user);
  const todayKey = getLocalTodayDateKey();
  const {
    myAnsweredDateKeys,
    partnerAnsweredDateKeys,
    data: checkInRecords,
  } = useCheckInRecords(enabled);
  const { lightCardCount, lightCardUsages } = useMindMap();

  const myLightKeys = useMemo(
    () =>
      toUsageDateKeySet(
        checkInRecords?.me?.lightCardUsages ?? lightCardUsages,
      ),
    [checkInRecords?.me?.lightCardUsages, lightCardUsages],
  );

  const partnerLightKeys = useMemo(
    () => toUsageDateKeySet(checkInRecords?.partner?.lightCardUsages),
    [checkInRecords?.partner?.lightCardUsages],
  );

  const myMarkedKeys = useMemo(() => {
    const set = unionSets(myAnsweredDateKeys, myLightKeys);
    if (partnerStatus?.myTodayAnswered) {
      set.add(todayKey);
    }
    return set;
  }, [
    myAnsweredDateKeys,
    myLightKeys,
    partnerStatus?.myTodayAnswered,
    todayKey,
  ]);

  const partnerMarkedKeys = useMemo(() => {
    const set = unionSets(partnerAnsweredDateKeys, partnerLightKeys);
    if (partnerStatus?.partnerInfo?.todayAnswered) {
      set.add(todayKey);
    }
    return set;
  }, [
    partnerAnsweredDateKeys,
    partnerLightKeys,
    partnerStatus?.partnerInfo?.todayAnswered,
    todayKey,
  ]);

  const eitherLightKeys = useMemo(
    () => unionSets(myLightKeys, partnerLightKeys),
    [myLightKeys, partnerLightKeys],
  );

  const jointMarkedKeys = useMemo(
    () =>
      unionSets(
        intersectSets(myMarkedKeys, partnerMarkedKeys),
        eitherLightKeys,
      ),
    [eitherLightKeys, myMarkedKeys, partnerMarkedKeys],
  );

  const jointLightKeys = eitherLightKeys;

  const jointAnsweredStyleKeys = useMemo(() => {
    const set = new Set(jointMarkedKeys);
    jointLightKeys.forEach((key) => set.delete(key));
    return set;
  }, [jointLightKeys, jointMarkedKeys]);

  const streakDays = useMemo(
    () => calcCurrentStreakDays(jointMarkedKeys, todayKey),
    [jointMarkedKeys, todayKey],
  );

  const monthNavKeys = useMemo(
    () => unionSets(myMarkedKeys, partnerMarkedKeys),
    [myMarkedKeys, partnerMarkedKeys],
  );

  const monthUsedCount = useMemo(() => {
    const usages =
      checkInRecords?.me?.lightCardUsages ?? lightCardUsages ?? [];
    return countUsagesInYearMonth(usages, toYearMonth(new Date()));
  }, [checkInRecords?.me?.lightCardUsages, lightCardUsages]);

  const myName = user?.nickName || user?.username || '我';
  const partnerInfo = partnerStatus?.partnerInfo;
  const partnerName =
    partnerInfo?.nickName || partnerInfo?.username || partnerInfo?.userId || '伙伴';
  const partnerAvatar =
    partnerInfo?.avatarUrl ?? partnerInfo?.avatarPath ?? partnerInfo?.avatar;

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}>
      <DuoStreakHero streakDays={streakDays} />

      <View style={styles.membersRow}>
        <DuoMemberCard
          displayName={myName}
          todayCompleted={myMarkedKeys.has(todayKey)}
        />
        <DuoMemberCard
          displayName={partnerName}
          avatarUrl={partnerAvatar}
          todayCompleted={partnerMarkedKeys.has(todayKey)}
        />
      </View>

      <PersonalCheckInCalendar
        answeredDateKeys={jointAnsweredStyleKeys}
        lightCardDateKeys={jointLightKeys}
        lightCardCount={lightCardCount}
        navigationDateKeys={monthNavKeys}
        myMarkedDateKeys={myMarkedKeys}
      />

      <LightCardBanner
        remainingCount={lightCardCount}
        monthUsedCount={monthUsedCount}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    paddingTop: 12,
    paddingBottom: 32,
  },
  membersRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 20,
    marginBottom: 4,
    gap: 12,
  },
});
