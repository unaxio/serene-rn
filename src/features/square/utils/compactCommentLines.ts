import type { SquareComment } from '@/src/features/square/types';
import { getAuthorDisplayName } from '@/src/features/square/utils/displayAuthor';

export interface CompactCommentLine {
  id: string;
  authorName: string;
  replyToName: string | null;
  content: string;
  comment: SquareComment;
}

export function formatCompactCommentLine(line: CompactCommentLine): string {
  if (line.replyToName) {
    return `${line.authorName}：回复${line.replyToName}：${line.content}`;
  }
  return `${line.authorName}：${line.content}`;
}

export function toCompactCommentLines(comments: SquareComment[]): CompactCommentLine[] {
  const lines: CompactCommentLine[] = [];
  comments.forEach((comment) => {
    const rootName = getAuthorDisplayName(comment.author);
    lines.push({
      id: comment.id,
      authorName: rootName,
      replyToName: null,
      content: comment.content,
      comment,
    });
    comment.topReplies.forEach((reply) => {
      lines.push({
        id: reply.id,
        authorName: getAuthorDisplayName(reply.author),
        replyToName: reply.parentAuthor
          ? getAuthorDisplayName(reply.parentAuthor)
          : rootName,
        content: reply.content,
        comment: reply,
      });
    });
  });
  return lines;
}
