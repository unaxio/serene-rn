import type { InfiniteData, QueryClient } from '@tanstack/react-query';

import { STORY_FEED_QUERY_ROOT, STORY_FEED_WINDOW_MS } from '@/src/features/square/constants';
import type { SquarePagedData, Story } from '@/src/features/square/types';

const windowStartedAt = new Map<string, number>();

export function markStoryFeedWindow(category: string): void {
  windowStartedAt.set(category, Date.now());
}

export function isStoryFeedWindowExpired(category: string): boolean {
  const startedAt = windowStartedAt.get(category);
  if (startedAt == null) {
    return false;
  }
  return Date.now() - startedAt >= STORY_FEED_WINDOW_MS;
}

/** 下拉刷新会重抽顺序，已加载的后续页不能再和这次的第 1 页拼在一起。 */
export function trimStoryFeedToFirstPage(
  data: InfiniteData<SquarePagedData<Story>> | undefined,
): InfiniteData<SquarePagedData<Story>> | undefined {
  if (!data || data.pages.length <= 1) {
    return data;
  }
  return {
    pages: data.pages.slice(0, 1),
    pageParams: data.pageParams.slice(0, 1),
  };
}

export function flattenStoryFeedPages(pages: SquarePagedData<Story>[] | undefined): Story[] {
  const seen = new Set<string>();
  const items: Story[] = [];
  for (const page of pages ?? []) {
    for (const item of page.items) {
      if (item.id.length === 0 || seen.has(item.id)) {
        continue;
      }
      seen.add(item.id);
      items.push(item);
    }
  }
  return items;
}

export function resetStoryFeedQueries(queryClient: QueryClient): void {
  queryClient.setQueriesData<InfiniteData<SquarePagedData<Story>>>(
    { queryKey: STORY_FEED_QUERY_ROOT },
    (current) => trimStoryFeedToFirstPage(current),
  );
}

export async function refreshStoryFeedQueries(queryClient: QueryClient): Promise<void> {
  resetStoryFeedQueries(queryClient);
  await queryClient.invalidateQueries({ queryKey: STORY_FEED_QUERY_ROOT });
}
