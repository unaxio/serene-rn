import {
  buildDateKey,
  calcCurrentStreakDays,
  normalizeCheckInDateKey,
} from '@/src/features/soulFlower/utils/checkInCalendar';

export function getLocalTodayDateKey(): string {
  const now = new Date();
  return buildDateKey(now.getFullYear(), now.getMonth() + 1, now.getDate());
}

export function toUsageDateKeySet(
  usages: Array<{ dateKey: string }> | undefined,
): Set<string> {
  const set = new Set<string>();
  (usages ?? []).forEach((usage) => {
    const key = normalizeCheckInDateKey(usage.dateKey);
    if (key) {
      set.add(key);
    }
  });
  return set;
}

export function intersectSets(a: Set<string>, b: Set<string>): Set<string> {
  const result = new Set<string>();
  a.forEach((key) => {
    if (b.has(key)) {
      result.add(key);
    }
  });
  return result;
}

export function unionSets(a: Set<string>, b: Set<string>): Set<string> {
  const result = new Set(a);
  b.forEach((key) => result.add(key));
  return result;
}

interface BuildJointMarkedDateKeysParams {
  myAnsweredDateKeys: Set<string>;
  partnerAnsweredDateKeys: Set<string>;
  myLightKeys: Set<string>;
  partnerLightKeys: Set<string>;
  todayKey: string;
  myTodayAnswered?: boolean;
  partnerTodayAnswered?: boolean;
}

/**
 * 共同打卡日：
 * - 双方都有记录（答题或续光卡）的交集
 * - 或任一方使用了续光卡的日期（单独也算共同打卡）
 */
export function buildJointMarkedDateKeys({
  myAnsweredDateKeys,
  partnerAnsweredDateKeys,
  myLightKeys,
  partnerLightKeys,
  todayKey,
  myTodayAnswered = false,
  partnerTodayAnswered = false,
}: BuildJointMarkedDateKeysParams): Set<string> {
  const myMarkedKeys = unionSets(myAnsweredDateKeys, myLightKeys);
  if (myTodayAnswered) {
    myMarkedKeys.add(todayKey);
  }

  const partnerMarkedKeys = unionSets(
    partnerAnsweredDateKeys,
    partnerLightKeys,
  );
  if (partnerTodayAnswered) {
    partnerMarkedKeys.add(todayKey);
  }

  const eitherLightKeys = unionSets(myLightKeys, partnerLightKeys);
  return unionSets(
    intersectSets(myMarkedKeys, partnerMarkedKeys),
    eitherLightKeys,
  );
}

export function calcJointStreakDays(
  params: BuildJointMarkedDateKeysParams,
): number {
  return calcCurrentStreakDays(
    buildJointMarkedDateKeys(params),
    params.todayKey,
  );
}
