export const STREAK_GOAL_DAYS = 100;
export const STREAK_GOAL_MARKERS = [30, 60, 100] as const;

export const DAYS_PER_WEEK = 7;

export function formatStreakEncouragement(streakDays: number): {
  prefix: string;
  weeksLabel: string;
  middle: string;
  praise: string;
  suffix: string;
} | null {
  const weeks = Math.floor(streakDays / DAYS_PER_WEEK);
  if (weeks < 1) {
    return null;
  }

  return {
    prefix: '超过',
    weeksLabel: `${weeks}周`,
    middle: '啦，',
    praise: '真了不起',
    suffix: '！',
  };
}

export function clampStreakProgress(streakDays: number): number {
  return Math.min(Math.max(streakDays, 0), STREAK_GOAL_DAYS);
}
