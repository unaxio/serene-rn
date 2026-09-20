import type { CommentMention } from '@/src/features/square/types';

export const COMMENT_MENTION_MAX = 10;
export const COMMENT_MENTION_PAGE_SIZE = 20;
export const COMMENT_MENTION_DEBOUNCE_MS = 300;
export const COMMENT_MENTION_COLOR = '#2563EB';

const ASCII_TRIGGER = '@';
const FULLWIDTH_TRIGGER = '＠';
const TRAILING_SPACE = ' ';

export interface CommentMentionSpan {
  text: string;
  mention: CommentMention | null;
}

interface TextEdit {
  start: number;
  oldEnd: number;
  newEnd: number;
}

export function findActiveMentionQuery(
  text: string,
  cursor: number,
  mentions: CommentMention[],
): string | null {
  const head = text.slice(0, cursor);
  let triggerAt = -1;
  for (let index = head.length - 1; index >= 0; index -= 1) {
    const char = head[index] ?? '';
    if (char === ASCII_TRIGGER || char === FULLWIDTH_TRIGGER) {
      triggerAt = index;
      break;
    }
    if (isWhitespace(char)) {
      return null;
    }
  }
  if (triggerAt < 0) {
    return null;
  }
  if (mentions.some((mention) => triggerAt >= mention.start && triggerAt < mention.end)) {
    return null;
  }
  return head.slice(triggerAt + 1);
}

export function insertCommentMention(
  text: string,
  cursor: number,
  mentions: CommentMention[],
  user: { userId: string; nickName: string },
): { text: string; mentions: CommentMention[]; cursor: number } | null {
  const nickName = user.nickName.trim();
  const query = findActiveMentionQuery(text, cursor, mentions);
  if (query === null || nickName.length === 0 || user.userId.length === 0) {
    return null;
  }
  if (mentions.length >= COMMENT_MENTION_MAX) {
    return null;
  }
  const triggerAt = cursor - query.length - 1;
  const token = `${ASCII_TRIGGER}${nickName}`;
  const nextText = `${text.slice(0, triggerAt)}${token}${TRAILING_SPACE}${text.slice(cursor)}`;
  const inserted: CommentMention = {
    userId: user.userId,
    nickName,
    start: triggerAt,
    end: triggerAt + token.length,
  };
  const delta = token.length + TRAILING_SPACE.length - (cursor - triggerAt);
  const shifted = mentions.map((mention) =>
    mention.start >= cursor
      ? { ...mention, start: mention.start + delta, end: mention.end + delta }
      : mention,
  );
  return {
    text: nextText,
    mentions: [...shifted, inserted].sort((left, right) => left.start - right.start),
    cursor: triggerAt + token.length + TRAILING_SPACE.length,
  };
}

export function applyCommentTextChange(
  previous: string,
  next: string,
  mentions: CommentMention[],
): { text: string; mentions: CommentMention[]; cursor: number } {
  if (previous === next) {
    return { text: next, mentions, cursor: next.length };
  }
  const edit = findTextEdit(previous, next);
  const overlapped = mentions.filter((mention) => rangesOverlap(mention.start, mention.end, edit.start, edit.oldEnd));
  if (overlapped.length === 0) {
    const delta = edit.newEnd - edit.start - (edit.oldEnd - edit.start);
    return {
      text: next,
      mentions: mentions.map((mention) =>
        mention.start >= edit.oldEnd
          ? { ...mention, start: mention.start + delta, end: mention.end + delta }
          : mention,
      ),
      cursor: edit.newEnd,
    };
  }
  const removed = [...overlapped].sort((left, right) => right.start - left.start);
  let text = previous;
  removed.forEach((mention) => {
    text = `${text.slice(0, mention.start)}${text.slice(mention.end)}`;
  });
  const kept = mentions
    .filter((mention) => !overlapped.includes(mention))
    .map((mention) => {
      const shift = removed
        .filter((item) => item.end <= mention.start)
        .reduce((sum, item) => sum + (item.end - item.start), 0);
      return { ...mention, start: mention.start - shift, end: mention.end - shift };
    });
  return { text, mentions: kept, cursor: overlapped[0]?.start ?? edit.start };
}

export function trimCommentDraft(
  text: string,
  mentions: CommentMention[],
): { content: string; mentions: CommentMention[] } {
  const leading = text.length - text.trimStart().length;
  const content = text.trim();
  const nextMentions = mentions.flatMap((mention) => {
    const start = mention.start - leading;
    const end = mention.end - leading;
    if (start < 0 || end > content.length || content.slice(start, end) !== `${ASCII_TRIGGER}${mention.nickName}`) {
      return [];
    }
    return [{ ...mention, start, end }];
  });
  return { content, mentions: nextMentions };
}

export function splitCommentMentions(content: string, mentions: CommentMention[]): CommentMentionSpan[] {
  const valid = mentions
    .filter((mention) => content.slice(mention.start, mention.end) === `${ASCII_TRIGGER}${mention.nickName}`)
    .sort((left, right) => left.start - right.start);
  const spans: CommentMentionSpan[] = [];
  let cursor = 0;
  valid.forEach((mention) => {
    if (mention.start > cursor) {
      spans.push({ text: content.slice(cursor, mention.start), mention: null });
    }
    spans.push({ text: content.slice(mention.start, mention.end), mention });
    cursor = mention.end;
  });
  if (cursor < content.length) {
    spans.push({ text: content.slice(cursor), mention: null });
  }
  return spans.length > 0 ? spans : [{ text: content, mention: null }];
}

function findTextEdit(previous: string, next: string): TextEdit {
  let start = 0;
  const previousEnd = previous.length;
  const nextEnd = next.length;
  while (start < previousEnd && start < nextEnd && previous[start] === next[start]) {
    start += 1;
  }
  let oldEnd = previousEnd;
  let newEnd = nextEnd;
  while (oldEnd > start && newEnd > start && previous[oldEnd - 1] === next[newEnd - 1]) {
    oldEnd -= 1;
    newEnd -= 1;
  }
  return { start, oldEnd, newEnd };
}

function rangesOverlap(start: number, end: number, editStart: number, editEnd: number): boolean {
  return start < editEnd && editStart < end;
}

function isWhitespace(char: string): boolean {
  return char.trim().length === 0;
}
