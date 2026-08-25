const BLUE = '#3612dd';
const PURPLE = '#8643ef';
const RED = '#E8575c';

type Rgb = readonly [number, number, number];

function hexToRgb(hex: string): Rgb {
  const normalized = hex.replace('#', '');
  return [
    Number.parseInt(normalized.slice(0, 2), 16),
    Number.parseInt(normalized.slice(2, 4), 16),
    Number.parseInt(normalized.slice(4, 6), 16),
  ];
}

function rgbToHex([r, g, b]: Rgb): string {
  const toHex = (value: number) =>
    Math.round(value).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function lerpColor(from: string, to: string, ratio: number): string {
  const t = Math.min(1, Math.max(0, ratio));
  const a = hexToRgb(from);
  const b = hexToRgb(to);
  return rgbToHex([
    a[0] + (b[0] - a[0]) * t,
    a[1] + (b[1] - a[1]) * t,
    a[2] + (b[2] - a[2]) * t,
  ]);
}

export interface ProgressGradient {
  colors: [string, string, ...string[]];
  locations: [number, number, ...number[]];
}

/**
 * 按当前进度截取蓝→紫→红渐变（满进度 0%蓝 / 50%紫 / 100%红）。
 */
export function getStreakProgressGradient(progressRatio: number): ProgressGradient {
  const p = Math.min(1, Math.max(0, progressRatio));

  if (p <= 0) {
    return { colors: [BLUE, BLUE], locations: [0, 1] };
  }

  if (p <= 0.5) {
    return {
      colors: [BLUE, lerpColor(BLUE, PURPLE, p / 0.5)],
      locations: [0, 1],
    };
  }

  return {
    colors: [BLUE, PURPLE, lerpColor(PURPLE, RED, (p - 0.5) / 0.5)],
    locations: [0, 0.5 / p, 1],
  };
}

export const STREAK_PROGRESS_BLUE = BLUE;
export const STREAK_PROGRESS_RED = RED;
