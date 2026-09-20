import { useRouter } from 'expo-router';
import { useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { APP_TEXT_COLOR } from '@/constants/Colors';
import { PROFILE_MUTED } from '@/src/features/profile/constants';
import type { ProfileCommentItem } from '@/src/features/profile/types';
import { openContentAnchor } from '@/src/features/square/utils/contentAnchor';

const ORIGIN_TITLE_FONT_SIZE = 12;
const ORIGIN_TITLE_CHAR_COUNT = 6;
const ORIGIN_TITLE_WIDTH = ORIGIN_TITLE_FONT_SIZE * ORIGIN_TITLE_CHAR_COUNT;
const ORIGIN_TITLE_MAX_LINES = 4;
const QUOTE_BAR_WIDTH = 2;

interface ProfileCommentRowProps {
  item: ProfileCommentItem;
}

function replyCaption(nickName: string): string {
  return `回复了${nickName}的评论`;
}

export function ProfileCommentRow({ item }: ProfileCommentRowProps) {
  const router = useRouter();
  const originTitle = item.source.titleOrSummary?.trim() ?? '';
  const parentSummary = item.source.parentSummary?.trim() ?? '';
  const parentName = item.source.parentAuthorNickName?.trim() ?? '';

  const handlePress = useCallback(() => {
    openContentAnchor(router, item.source, {
      highlightId: item.source.highlightId?.trim() || item.id,
    });
  }, [item.id, item.source, router]);

  return (
    <Pressable style={styles.row} onPress={handlePress}>
      <View style={styles.main}>
        {parentName ? <Text style={styles.caption}>{replyCaption(parentName)}</Text> : null}
        <Text style={styles.body}>{item.content}</Text>
        {parentSummary ? (
          <View style={styles.quote}>
            <View style={styles.quoteBar} />
            <Text style={styles.quoteText} numberOfLines={1}>
              {parentSummary}
            </Text>
          </View>
        ) : null}
      </View>
      {originTitle ? (
        <Text style={styles.origin} numberOfLines={ORIGIN_TITLE_MAX_LINES}>
          {originTitle}
        </Text>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    gap: 12,
  },
  main: { flex: 1, minWidth: 0, gap: 4 },
  caption: { fontSize: 13, fontWeight: '600', color: APP_TEXT_COLOR, lineHeight: 18 },
  body: { fontSize: 14, color: APP_TEXT_COLOR, lineHeight: 20 },
  quote: { flexDirection: 'row', alignItems: 'stretch', gap: 6, minWidth: 0 },
  quoteBar: {
    width: QUOTE_BAR_WIDTH,
    borderRadius: 1,
    backgroundColor: '#CBD5E1',
  },
  quoteText: { flex: 1, fontSize: 12, color: PROFILE_MUTED, lineHeight: 18 },
  origin: {
    width: ORIGIN_TITLE_WIDTH,
    fontSize: ORIGIN_TITLE_FONT_SIZE,
    lineHeight: 16,
    color: PROFILE_MUTED,
  },
});
