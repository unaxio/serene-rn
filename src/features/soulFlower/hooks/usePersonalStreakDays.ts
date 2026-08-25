import { useMemo } from 'react';

import { useCheckInRecords } from '@/src/features/soulFlower/hooks/useCheckInRecords';
import { useMindMap } from '@/src/features/soulFlower/hooks/useMindMap';
import { calcCurrentStreakDays } from '@/src/features/soulFlower/utils/checkInCalendar';
import {
  getLocalTodayDateKey,
  toUsageDateKeySet,
  unionSets,
} from '@/src/features/soulFlower/utils/jointCheckIn';

interface UsePersonalStreakDaysOptions {
  enabled?: boolean;
  myTodayAnswered?: boolean;
}

/** 与个人打卡页一致：答题日 + 续光卡日本地计算连续天数 */
export function usePersonalStreakDays({
  enabled = true,
  myTodayAnswered = false,
}: UsePersonalStreakDaysOptions = {}): number {
  const todayKey = getLocalTodayDateKey();
  const { myAnsweredDateKeys, data: checkInRecords } =
    useCheckInRecords(enabled);
  const { lightCardUsages } = useMindMap();

  const lightCardDateKeys = useMemo(
    () =>
      toUsageDateKeySet(
        checkInRecords?.me?.lightCardUsages ?? lightCardUsages,
      ),
    [checkInRecords?.me?.lightCardUsages, lightCardUsages],
  );

  return useMemo(() => {
    const marked = unionSets(myAnsweredDateKeys, lightCardDateKeys);
    if (myTodayAnswered) {
      marked.add(todayKey);
    }
    return calcCurrentStreakDays(marked, todayKey);
  }, [lightCardDateKeys, myAnsweredDateKeys, myTodayAnswered, todayKey]);
}
