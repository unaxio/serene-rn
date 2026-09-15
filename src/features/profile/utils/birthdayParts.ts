export interface BirthdayParts {
  year: number;
  month: number;
  day: number;
}

export function parseBirthdayParts(birthday: string | null | undefined): BirthdayParts | null {
  if (!birthday) {
    return null;
  }
  const digits = birthday.replace(/\D/g, '');
  if (digits.length < 8) {
    return null;
  }
  const year = Number(digits.slice(0, 4));
  const month = Number(digits.slice(4, 6));
  const day = Number(digits.slice(6, 8));
  if (
    !Number.isFinite(year) ||
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > 31
  ) {
    return null;
  }
  return { year, month, day };
}

export function formatBirthdayParts(parts: BirthdayParts): string {
  const month = String(parts.month).padStart(2, '0');
  const day = String(parts.day).padStart(2, '0');
  return `${parts.year}-${month}-${day}`;
}

export function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}
