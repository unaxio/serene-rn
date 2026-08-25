import { useMemo } from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import { LightCardBanner } from '@/src/features/soulFlower/components/LightCardBanner';
import { PersonalCheckInCalendar } from '@/src/features/soulFlower/components/PersonalCheckInCalendar';
import { PersonalGoalProgress } from '@/src/features/soulFlower/components/PersonalGoalProgress';
import { PersonalStreakHero } from '@/src/features/soulFlower/components/PersonalStreakHero';
import { useCheckInRecords } from '@/src/features/soulFlower/hooks/useCheckInRecords';
import { useMindMap } from '@/src/features/soulFlower/hooks/useMindMap';
import type { PartnerStatusResponse } from '@/src/features/soulFlower/types';
import {
  buildDateKey,
  calcCurrentStreakDays,
  countUsagesInYearMonth,
  normalizeCheckInDateKey,
  toYearMonth,
} from '@/src/features/soulFlower/utils/checkInCalendar';

interface PersonalCheckInPanelProps {
  partnerStatus?: PartnerStatusResponse;
  enabled: boolean;
}

function getLocalTodayDateKey(): string {
  const now = new Date();
  return buildDateKey(now.getFullYear(), now.getMonth() + 1, now.getDate());
}

export function PersonalCheckInPanel({
  partnerStatus,
  enabled,
}: PersonalCheckInPanelProps) {
  const todayKey = getLocalTodayDateKey();
  const todayAnsweredFromStatus = partnerStatus?.myTodayAnswered === true;
  const { myAnsweredDateKeys, data: checkInRecords } = useCheckInRecords(enabled);
  const { lightCardCount, lightCardUsages } = useMindMap();

  const lightCardDateKeys = useMemo(() => {
    const set = new Set<string>();
    const usages =
      checkInRecords?.me?.lightCardUsages ?? lightCardUsages ?? [];
    usages.forEach((usage) => {
      const key = normalizeCheckInDateKey(usage.dateKey);
      if (key) {
        set.add(key);
      }
    });
    return set;
  }, [checkInRecords?.me?.lightCardUsages, lightCardUsages]);

  const answeredDateKeys = useMemo(() => {
    const set = new Set(myAnsweredDateKeys);
    if (todayAnsweredFromStatus) {
      set.add(todayKey);
    }
    return set;
  }, [myAnsweredDateKeys, todayAnsweredFromStatus, todayKey]);

  const markedDateKeys = useMemo(() => {
    const set = new Set(answeredDateKeys);
    lightCardDateKeys.forEach((key) => set.add(key));
    return set;
  }, [answeredDateKeys, lightCardDateKeys]);

  const streakDays = useMemo(
    () => calcCurrentStreakDays(markedDateKeys, todayKey),
    [markedDateKeys, todayKey],
  );

  const todayCompleted = markedDateKeys.has(todayKey);

  const monthUsedCount = useMemo(() => {
    const usages =
      checkInRecords?.me?.lightCardUsages ?? lightCardUsages ?? [];
    return countUsagesInYearMonth(usages, toYearMonth(new Date()));
  }, [checkInRecords?.me?.lightCardUsages, lightCardUsages]);

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}>
      <PersonalStreakHero
        streakDays={streakDays}
        todayAnswered={todayCompleted}
      />
      <PersonalGoalProgress streakDays={streakDays} />
      <PersonalCheckInCalendar
        answeredDateKeys={answeredDateKeys}
        lightCardDateKeys={lightCardDateKeys}
        lightCardCount={lightCardCount}
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
});
