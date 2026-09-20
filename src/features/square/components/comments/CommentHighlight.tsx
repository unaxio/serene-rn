import { useEffect, useRef, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { useCommentHighlight } from '@/src/features/square/utils/commentFocusCue';
import { scrollFocusedComment } from '@/src/features/square/utils/commentFocusScroll';

const HIGHLIGHT_BACKGROUND = '#FEF3C7';
const SCROLL_INTO_VIEW_DELAY_MS = 50;

interface CommentHighlightProps {
  commentId: string;
  scrollIntoView?: boolean;
  children: ReactNode;
}

export function CommentHighlight({
  commentId,
  scrollIntoView = true,
  children,
}: CommentHighlightProps) {
  const active = useCommentHighlight(commentId);
  const viewRef = useRef<View>(null);
  const scrolledRef = useRef(false);

  useEffect(() => {
    if (!active || !scrollIntoView || scrolledRef.current) {
      return;
    }
    const timer = setTimeout(() => {
      viewRef.current?.measureInWindow((_x, y) => {
        if (scrolledRef.current) {
          return;
        }
        scrolledRef.current = true;
        scrollFocusedComment(y);
      });
    }, SCROLL_INTO_VIEW_DELAY_MS);
    return () => clearTimeout(timer);
  }, [active, scrollIntoView]);

  return (
    <View ref={viewRef} style={active ? styles.active : undefined}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  active: {
    backgroundColor: HIGHLIGHT_BACKGROUND,
    borderRadius: 8,
  },
});
