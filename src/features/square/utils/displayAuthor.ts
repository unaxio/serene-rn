import {
  ANONYMOUS_DISPLAY_NAME,
  DEFAULT_AUTHOR_LEVEL,
} from '@/src/features/square/constants';
import type { SquareAuthor } from '@/src/features/square/types';

export function isAnonymousAuthor(author: SquareAuthor | null | undefined): boolean {
  if (!author) {
    return true;
  }
  return author.id === null || author.nickName === ANONYMOUS_DISPLAY_NAME;
}

export function getAuthorDisplayName(author: SquareAuthor | null | undefined): string {
  if (!author || isAnonymousAuthor(author)) {
    return ANONYMOUS_DISPLAY_NAME;
  }
  const name = author.nickName?.trim();
  return name && name.length > 0 ? name : ANONYMOUS_DISPLAY_NAME;
}

export function getReplyPlaceholder(author: SquareAuthor | null | undefined): string {
  return `回复 ${getAuthorDisplayName(author)}`;
}

export function getAuthorLevelLabel(author: SquareAuthor | null | undefined): string {
  const level = author?.level ?? DEFAULT_AUTHOR_LEVEL;
  return `Lv.${level}`;
}

export function getAuthorAvatarPath(author: SquareAuthor | null | undefined): string | null {
  if (!author || isAnonymousAuthor(author)) {
    return null;
  }
  const url = author.avatarUrl?.trim();
  return url && url.length > 0 ? url : null;
}
