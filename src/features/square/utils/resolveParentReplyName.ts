import type { SquareComment } from '@/src/features/square/types';
import { getAuthorDisplayName } from '@/src/features/square/utils/displayAuthor';

export function resolveParentReplyName(
  item: SquareComment,
  parentNameMap: Map<string, string>,
): string | null {
  if (!item.parentId || item.parentId === item.rootId) {
    return null;
  }
  if (item.parentAuthor) {
    return getAuthorDisplayName(item.parentAuthor);
  }
  return parentNameMap.get(item.parentId) ?? null;
}
