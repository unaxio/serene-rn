import { CONNECT_BADGE_CAP } from '@/src/features/connect/constants';

export function formatUnreadBadge(count: number): string | undefined {
  if (count <= 0) {
    return undefined;
  }
  if (count > CONNECT_BADGE_CAP) {
    return `${CONNECT_BADGE_CAP}+`;
  }
  return String(count);
}
