const CONSTELLATION_TABLE: { name: string; month: number; day: number }[] = [
  { name: '水瓶座', month: 1, day: 20 },
  { name: '双鱼座', month: 2, day: 19 },
  { name: '白羊座', month: 3, day: 21 },
  { name: '金牛座', month: 4, day: 20 },
  { name: '双子座', month: 5, day: 21 },
  { name: '巨蟹座', month: 6, day: 22 },
  { name: '狮子座', month: 7, day: 23 },
  { name: '处女座', month: 8, day: 23 },
  { name: '天秤座', month: 9, day: 23 },
  { name: '天蝎座', month: 10, day: 24 },
  { name: '射手座', month: 11, day: 23 },
  { name: '摩羯座', month: 12, day: 22 },
];

/**
 * 根据生日计算星座。支持 YYYY-MM-DD / YYYYMMDD。
 * 不落库，仅展示。
 */
export function getConstellationFromBirthday(birthday: string | null | undefined): string {
  if (!birthday) {
    return '—';
  }
  const digits = birthday.replace(/\D/g, '');
  if (digits.length < 8) {
    return '—';
  }
  const month = Number(digits.slice(4, 6));
  const day = Number(digits.slice(6, 8));
  if (month < 1 || month > 12 || day < 1 || day > 31) {
    return '—';
  }
  for (let index = 0; index < CONSTELLATION_TABLE.length; index += 1) {
    const current = CONSTELLATION_TABLE[index];
    const next = CONSTELLATION_TABLE[(index + 1) % CONSTELLATION_TABLE.length];
    if (
      (month === current.month && day >= current.day) ||
      (month === next.month && day < next.day)
    ) {
      return current.name;
    }
  }
  return '摩羯座';
}

export function calcAgeFromBirthday(birthday: string | null | undefined): number | null {
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
  const now = new Date();
  let age = now.getFullYear() - year;
  const beforeBirthday =
    now.getMonth() + 1 < month || (now.getMonth() + 1 === month && now.getDate() < day);
  if (beforeBirthday) {
    age -= 1;
  }
  return age >= 0 && age < 150 ? age : null;
}

export function formatGenderLabel(gender: string | null | undefined): string {
  switch (gender) {
    case 'male':
      return '男';
    case 'female':
      return '女';
    case 'other':
      return '其他';
    default:
      return '保密';
  }
}

export function formatBirthdayInput(birthday: string | null | undefined): string {
  if (!birthday) {
    return '';
  }
  const digits = birthday.replace(/\D/g, '');
  if (digits.length === 8) {
    return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6, 8)}`;
  }
  return birthday;
}

export function toBirthdayPayload(value: string): string {
  const digits = value.replace(/\D/g, '');
  return digits.length >= 8 ? digits.slice(0, 8) : value.trim();
}
