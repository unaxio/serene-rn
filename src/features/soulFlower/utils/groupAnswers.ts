import type { FlowerCardAnswerItem } from '@/src/features/soulFlower/types';
import { formatChineseDate, toDateKey } from '@/src/features/soulFlower/utils/date';

export interface AwarenessDateGroup {
  dateKey: string;
  dateLabel: string;
  items: FlowerCardAnswerItem[];
}

export function groupAnswersByDate(records: FlowerCardAnswerItem[]): AwarenessDateGroup[] {
  const map = new Map<string, AwarenessDateGroup>();
  const sorted = [...records].sort(
    (left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
  );

  sorted.forEach((record) => {
    const dateKey = toDateKey(record.createdAt);
    const existing = map.get(dateKey);
    if (existing) {
      existing.items.push(record);
      return;
    }
    map.set(dateKey, {
      dateKey,
      dateLabel: formatChineseDate(record.createdAt),
      items: [record],
    });
  });

  return Array.from(map.values());
}
