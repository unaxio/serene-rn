import type { SquareComment } from '@/src/features/square/types';

export function getCommentNextPage(lastPage: {
  page: number;
  pageSize: number;
  total: number;
}): number | undefined {
  const loaded = lastPage.page * lastPage.pageSize;
  return loaded < lastPage.total ? lastPage.page + 1 : undefined;
}

export function dedupeComments(items: SquareComment[]): SquareComment[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.id)) {
      return false;
    }
    seen.add(item.id);
    return true;
  });
}
