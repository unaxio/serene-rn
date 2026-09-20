import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { useCommentHighlight } from '@/src/features/square/utils/commentFocusCue';

interface CommentHighlightProps {
  commentId: string;
  children: ReactNode;
}

const HIGHLIGHT_BACKGROUND = '#FEF3C7';

export function CommentHighlight({ commentId, children }: CommentHighlightProps) {
  const active = useCommentHighlight(commentId);
  return <View style={active ? styles.active : undefined}>{children}</View>;
}

const styles = StyleSheet.create({
  active: {
    backgroundColor: HIGHLIGHT_BACKGROUND,
    borderRadius: 8,
  },
});
