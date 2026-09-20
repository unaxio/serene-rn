import { useEffect } from 'react';

import { bindCommentFocusScroll } from '@/src/features/square/utils/commentFocusScroll';

interface FocusScrollTarget {
  scrollTo: (options: { y: number; animated?: boolean }) => void;
}

export function useBindCommentFocusScroll(
  scrollRef: { readonly current: FocusScrollTarget | null },
  getOffsetY: () => number,
): void {
  useEffect(() => {
    bindCommentFocusScroll({
      getOffsetY,
      scrollTo: (y) => scrollRef.current?.scrollTo({ y, animated: true }),
    });
    return () => bindCommentFocusScroll(null);
  }, [getOffsetY, scrollRef]);
}
