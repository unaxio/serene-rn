export function isOwnSquareAuthor(
  authorId: string | null | undefined,
  currentUserId: string | null | undefined,
): boolean {
  if (!authorId || !currentUserId) {
    return false;
  }
  return authorId === currentUserId;
}
