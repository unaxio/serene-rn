import { useMemo } from 'react';

import { useCheckInRecords } from '@/src/features/soulFlower/hooks/useCheckInRecords';
import { useMindMap } from '@/src/features/soulFlower/hooks/useMindMap';
import {
  calcJointStreakDays,
  getLocalTodayDateKey,
  toUsageDateKeySet,
} from '@/src/features/soulFlower/utils/jointCheckIn';

interface UseJointStreakDaysOptions {
  enabled: boolean;
  myTodayAnswered?: boolean;
  partnerTodayAnswered?: boolean;
}

/** 与双人打卡页一致：用 check-in 记录本地计算共同连续天数 */
export function useJointStreakDays({
  enabled,
  myTodayAnswered = false,
  partnerTodayAnswered = false,
}: UseJointStreakDaysOptions): number {
  const todayKey = getLocalTodayDateKey();
  const {
    myAnsweredDateKeys,
    partnerAnsweredDateKeys,
    data: checkInRecords,
  } = useCheckInRecords(enabled);
  const { lightCardUsages } = useMindMap();

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

  return useMemo(
    () =>
      calcJointStreakDays({
        myAnsweredDateKeys,
        partnerAnsweredDateKeys,
        myLightKeys,
        partnerLightKeys,
        todayKey,
        myTodayAnswered,
        partnerTodayAnswered,
      }),
    [
      myAnsweredDateKeys,
      partnerAnsweredDateKeys,
      myLightKeys,
      partnerLightKeys,
      todayKey,
      myTodayAnswered,
      partnerTodayAnswered,
    ],
  );
}
