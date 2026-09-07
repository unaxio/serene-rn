import { Pressable, StyleSheet, Text, View } from 'react-native';

import { APP_TEXT_COLOR } from '@/constants/Colors';
import {
  ASK_ANSWER_COUNT_SUFFIX,
  ASK_SECTION_DIVIDER_HEIGHT,
  COMMENT_HORIZONTAL_PADDING,
  MUTED_TEXT_COLOR,
  PAGE_SURFACE_COLOR,
  SQUARE_PAGE_BG,
} from '@/src/features/square/constants';
import type { Ask } from '@/src/features/square/types';

interface AskAnswerQuestionHeaderProps {
  ask: Ask;
  onOpenAsk: () => void;
}

const TITLE_FONT_SIZE = 22;
const TITLE_LINE_HEIGHT = 30;
const META_FONT_SIZE = 13;
const SECTION_GAP = 10;

export function AskAnswerQuestionHeader({ ask, onOpenAsk }: AskAnswerQuestionHeaderProps) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>{ask.title}</Text>
      <Pressable onPress={onOpenAsk} hitSlop={8}>
        <Text style={styles.meta}>
          {ask.answerCount}
          {ASK_ANSWER_COUNT_SUFFIX}
        </Text>
      </Pressable>
      <View style={styles.divider} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: COMMENT_HORIZONTAL_PADDING,
    paddingTop: 8,
    gap: SECTION_GAP,
    backgroundColor: PAGE_SURFACE_COLOR,
  },
  title: {
    fontSize: TITLE_FONT_SIZE,
    fontWeight: '700',
    lineHeight: TITLE_LINE_HEIGHT,
    color: APP_TEXT_COLOR,
  },
  meta: {
    fontSize: META_FONT_SIZE,
    color: MUTED_TEXT_COLOR,
    textAlign: 'left',
  },
  divider: {
    height: ASK_SECTION_DIVIDER_HEIGHT,
    backgroundColor: SQUARE_PAGE_BG,
    marginHorizontal: -COMMENT_HORIZONTAL_PADDING,
  },
});
