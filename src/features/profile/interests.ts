import { MAX_INTEREST_TOPICS } from '@/src/features/profile/constants';

export interface InterestGroup {
  category: string;
  topics: string[];
}

export interface InterestBoard {
  catalogs: InterestGroup[];
  items: InterestGroup[];
}

export interface InterestSavePayload {
  items: InterestGroup[];
}

interface InterestGroupRaw {
  category?: string;
  topics?: string[];
}

interface InterestBoardRaw {
  items?: InterestGroupRaw[];
  catalogs?: InterestGroupRaw[];
}

function textList(value: string[] | undefined): string[] {
  if (!Array.isArray(value)) {
    return [];
  }
  const seen = new Set<string>();
  const topics: string[] = [];
  value.forEach((item) => {
    if (typeof item !== 'string') {
      return;
    }
    const topic = item.trim();
    if (!topic || seen.has(topic)) {
      return;
    }
    seen.add(topic);
    topics.push(topic);
  });
  return topics;
}

function groupsOf(value: InterestGroupRaw[] | undefined): InterestGroup[] {
  if (!Array.isArray(value)) {
    return [];
  }
  const seen = new Set<string>();
  const groups: InterestGroup[] = [];
  value.forEach((item) => {
    const category = typeof item?.category === 'string' ? item.category.trim() : '';
    if (!category || seen.has(category)) {
      return;
    }
    seen.add(category);
    groups.push({ category, topics: textList(item.topics) });
  });
  return groups;
}

export function normalizeInterests(data: InterestBoardRaw | null | undefined): InterestBoard {
  return {
    catalogs: groupsOf(data?.catalogs),
    items: groupsOf(data?.items),
  };
}

export function toggleInterestCategory(items: InterestGroup[], category: string): InterestGroup[] {
  if (items.some((item) => item.category === category)) {
    return items.filter((item) => item.category !== category);
  }
  return items.concat({ category, topics: [] });
}

export function toggleInterestTopic(
  items: InterestGroup[],
  category: string,
  topic: string,
): { items: InterestGroup[]; limited: boolean } {
  const current = items.find((item) => item.category === category);
  const selected = current?.topics ?? [];
  if (selected.includes(topic)) {
    const topics = selected.filter((item) => item !== topic);
    return {
      items: items.map((item) => (item.category === category ? { category, topics } : item)),
      limited: false,
    };
  }
  if (selected.length >= MAX_INTEREST_TOPICS) {
    return { items, limited: true };
  }
  const topics = selected.concat(topic);
  if (!current) {
    return { items: items.concat({ category, topics }), limited: false };
  }
  return {
    items: items.map((item) => (item.category === category ? { category, topics } : item)),
    limited: false,
  };
}

export function sanitizeInterestItems(items: InterestGroup[], catalogs: InterestGroup[]): InterestGroup[] {
  return catalogs.flatMap((catalog) => {
    const picked = items.find((item) => item.category === catalog.category);
    if (!picked) {
      return [];
    }
    const allowed = new Set(catalog.topics);
    const topics = picked.topics.filter((topic) => allowed.has(topic)).slice(0, MAX_INTEREST_TOPICS);
    return [{ category: catalog.category, topics }];
  });
}
