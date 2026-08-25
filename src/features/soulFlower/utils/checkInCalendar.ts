const DATE_PAD_LENGTH = 2;

export interface YearMonth {
  year: number;
  month: number; // 1-12
}

export interface CalendarDayCell {
  day: number | null;
  dateKey: string | null;
  /** 答题或续光卡补签，均参与连续条 */
  checkedIn: boolean;
  /** 续光卡补签（黄圈） */
  isLightCard: boolean;
}

export interface ConsecutiveRun {
  startCol: number;
  endCol: number;
}

function padTwoDigits(value: number): string {
  return String(value).padStart(DATE_PAD_LENGTH, '0');
}

export function toYearMonth(date: Date): YearMonth {
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
  };
}

export function yearMonthKey(value: YearMonth): string {
  return `${value.year}-${padTwoDigits(value.month)}`;
}

export function compareYearMonth(a: YearMonth, b: YearMonth): number {
  if (a.year !== b.year) {
    return a.year - b.year;
  }
  return a.month - b.month;
}

export function shiftYearMonth(value: YearMonth, delta: number): YearMonth {
  const date = new Date(value.year, value.month - 1 + delta, 1);
  return toYearMonth(date);
}

export function formatYearMonthLabel(value: YearMonth): string {
  return `${value.year}年${value.month}月`;
}

/** 兼容 YYYY-MM-DD / YYYYMMDD / ISO */
export function normalizeCheckInDateKey(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) {
    return null;
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return trimmed;
  }

  if (/^\d{8}$/.test(trimmed)) {
    return `${trimmed.slice(0, 4)}-${trimmed.slice(4, 6)}-${trimmed.slice(6, 8)}`;
  }

  const date = new Date(trimmed);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return `${date.getFullYear()}-${padTwoDigits(date.getMonth() + 1)}-${padTwoDigits(date.getDate())}`;
}

export function buildDateKey(year: number, month: number, day: number): string {
  return `${year}-${padTwoDigits(month)}-${padTwoDigits(day)}`;
}

/** API 使用的 YYYYMMDD */
export function toCompactDateKey(normalizedDateKey: string): string {
  return normalizedDateKey.replace(/-/g, '');
}

export function shiftDateKey(normalizedDateKey: string, deltaDays: number): string {
  const [yearText, monthText, dayText] = normalizedDateKey.split('-');
  const date = new Date(
    Number(yearText),
    Number(monthText) - 1,
    Number(dayText) + deltaDays,
  );
  return buildDateKey(date.getFullYear(), date.getMonth() + 1, date.getDate());
}

/**
 * 按答题+续光卡日期计算当前连续天数：
 * 今日有记录则从今日往前；否则从昨日往前；断层即停。
 */
export function calcCurrentStreakDays(
  markedDateKeys: Set<string>,
  todayKey: string,
): number {
  let cursor = markedDateKeys.has(todayKey)
    ? todayKey
    : shiftDateKey(todayKey, -1);

  let streak = 0;
  while (markedDateKeys.has(cursor)) {
    streak += 1;
    cursor = shiftDateKey(cursor, -1);
  }
  return streak;
}

export function countUsagesInYearMonth(
  usages: Array<{ dateKey: string }>,
  yearMonth: YearMonth,
): number {
  const prefix = `${yearMonth.year}${padTwoDigits(yearMonth.month)}`;
  const dashedPrefix = `${yearMonth.year}-${padTwoDigits(yearMonth.month)}`;
  return usages.filter((usage) => {
    const key = usage.dateKey.trim();
    return key.startsWith(prefix) || key.startsWith(dashedPrefix);
  }).length;
}

export function getMonthBoundsFromDateKeys(dateKeys: string[]): {
  min: YearMonth;
  max: YearMonth;
} {
  const now = toYearMonth(new Date());
  if (dateKeys.length === 0) {
    return { min: now, max: now };
  }

  let min = now;
  let max = now;
  let initialized = false;

  dateKeys.forEach((key) => {
    const [yearText, monthText] = key.split('-');
    const year = Number(yearText);
    const month = Number(monthText);
    if (!year || !month) {
      return;
    }
    const current = { year, month };
    if (!initialized) {
      min = current;
      max = current;
      initialized = true;
      return;
    }
    if (compareYearMonth(current, min) < 0) {
      min = current;
    }
    if (compareYearMonth(current, max) > 0) {
      max = current;
    }
  });

  return { min, max };
}

/** 周日为一周起始，构建当月日历网格 */
export function buildMonthGrid(
  yearMonth: YearMonth,
  answeredDateKeys: Set<string>,
  lightCardDateKeys: Set<string> = new Set(),
): CalendarDayCell[][] {
  const firstDay = new Date(yearMonth.year, yearMonth.month - 1, 1);
  const daysInMonth = new Date(yearMonth.year, yearMonth.month, 0).getDate();
  const startWeekday = firstDay.getDay();

  const cells: CalendarDayCell[] = [];
  for (let i = 0; i < startWeekday; i += 1) {
    cells.push({ day: null, dateKey: null, checkedIn: false, isLightCard: false });
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const dateKey = buildDateKey(yearMonth.year, yearMonth.month, day);
    const isLightCard = lightCardDateKeys.has(dateKey);
    const isAnswered = answeredDateKeys.has(dateKey);
    cells.push({
      day,
      dateKey,
      checkedIn: isAnswered || isLightCard,
      isLightCard: isLightCard && !isAnswered,
    });
  }

  while (cells.length % 7 !== 0) {
    cells.push({ day: null, dateKey: null, checkedIn: false, isLightCard: false });
  }

  const rows: CalendarDayCell[][] = [];
  for (let index = 0; index < cells.length; index += 7) {
    rows.push(cells.slice(index, index + 7));
  }
  return rows;
}

/** 同一行内连续打卡区间（列下标，含端点） */
export function getConsecutiveRuns(row: CalendarDayCell[]): ConsecutiveRun[] {
  const runs: ConsecutiveRun[] = [];
  let startCol: number | null = null;

  row.forEach((cell, col) => {
    if (cell.checkedIn) {
      if (startCol === null) {
        startCol = col;
      }
      return;
    }

    if (startCol !== null) {
      runs.push({ startCol, endCol: col - 1 });
      startCol = null;
    }
  });

  if (startCol !== null) {
    runs.push({ startCol, endCol: row.length - 1 });
  }

  return runs;
}
