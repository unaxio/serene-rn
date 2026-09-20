import { Text, type TextStyle } from 'react-native';

import type { CommentMention } from '@/src/features/square/types';
import { COMMENT_MENTION_COLOR, splitCommentMentions } from '@/src/features/square/utils/commentMention';

interface CommentMentionTextProps {
  content: string;
  mentions: CommentMention[];
  style?: TextStyle;
}

export function CommentMentionText({ content, mentions, style }: CommentMentionTextProps) {
  const spans = splitCommentMentions(content, mentions);
  return (
    <Text style={style}>
      {spans.map((span, index) => (
        <Text key={`${span.text}-${index}`} style={span.mention ? styles.mention : undefined}>
          {span.text}
        </Text>
      ))}
    </Text>
  );
}

const styles = {
  mention: { color: COMMENT_MENTION_COLOR },
};
