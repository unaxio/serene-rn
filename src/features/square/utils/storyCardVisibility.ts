/** 卡片与视口相交高度占卡片高度的比例。0 表示完全不可见。 */
export function storyVisibleRatio(
  cardY: number,
  cardHeight: number,
  viewportY: number,
  viewportHeight: number,
): number {
  if (cardHeight <= 0 || viewportHeight <= 0) {
    return 0;
  }
  const visibleTop = Math.max(cardY, viewportY);
  const visibleBottom = Math.min(cardY + cardHeight, viewportY + viewportHeight);
  const visibleHeight = visibleBottom - visibleTop;
  if (visibleHeight <= 0) {
    return 0;
  }
  return visibleHeight / cardHeight;
}
