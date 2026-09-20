const FOCUS_SCROLL_TOP = 120;

interface CommentFocusScrollBinding {
  getOffsetY: () => number;
  scrollTo: (y: number) => void;
}

let binding: CommentFocusScrollBinding | null = null;

export function bindCommentFocusScroll(next: CommentFocusScrollBinding | null): void {
  binding = next;
}

export function scrollFocusedComment(windowY: number): void {
  if (!binding) {
    return;
  }
  const nextOffset = binding.getOffsetY() + windowY - FOCUS_SCROLL_TOP;
  binding.scrollTo(Math.max(0, nextOffset));
}
