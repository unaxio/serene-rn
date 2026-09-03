const MS_PER_MINUTE = 60_000;
const MS_PER_HOUR = 3_600_000;
const MS_PER_DAY = 86_400_000;
const JUST_NOW_THRESHOLD_MS = MS_PER_MINUTE;
const DAY_THRESHOLD = 7;
const DATE_PAD_LENGTH = 2;

function padTwoDigits(value: number): string {
  return String(value).padStart(DATE_PAD_LENGTH, '0');
}

function formatAbsoluteDate(date: Date): string {
  return `${date.getFullYear()}-${padTwoDigits(date.getMonth() + 1)}-${padTwoDigits(date.getDate())}`;
}

export function formatRelativeTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return iso;
  }

  const diffMs = Date.now() - date.getTime();
  if (diffMs < JUST_NOW_THRESHOLD_MS) {
    return '刚刚';
  }

  const minutes = Math.floor(diffMs / MS_PER_MINUTE);
  if (minutes < 60) {
    return `${minutes}分钟前`;
  }

  const hours = Math.floor(diffMs / MS_PER_HOUR);
  if (hours < 24) {
    return `${hours}小时前`;
  }

  const days = Math.floor(diffMs / MS_PER_DAY);
  if (days <= DAY_THRESHOLD) {
    return `${days}天前`;
  }

  return formatAbsoluteDate(date);
}
