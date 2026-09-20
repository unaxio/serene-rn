import { useRouter } from 'expo-router';
import { useCallback } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { APP_TEXT_COLOR } from '@/constants/Colors';
import { PROFILE_MUTED } from '@/src/features/profile/constants';
import type { ProfileCommentItem } from '@/src/features/profile/types';
import {
  CONTENT_ORIGIN_LABEL,
  CONTENT_PARENT_LABEL,
  openContentAnchor,
} from '@/src/features/square/utils/contentAnchor';

interface ProfileCommentRowProps {
  item: ProfileCommentItem;
}

export function ProfileCommentRow({ item }: ProfileCommentRowProps) {
  const router = useRouter();
  const originTitle = item.source.titleOrSummary?.trim() ?? '';
  const parentSummary = item.source.parentSummary?.trim() ?? '';

  const handlePress = useCallback(() => {
    openContentAnchor(router, item.source, {
      highlightId: item.source.highlightId?.trim() || item.id,
    });
  }, [item.id, item.source, router]);

  return (
    <Pressable style={styles.row} onPress={handlePress}>
      <Text style={styles.body}>{item.content}</Text>
      {originTitle ? (
        <Text style={styles.source} numberOfLines={2}>
          {CONTENT_ORIGIN_LABEL}：{originTitle}
        </Text>
      ) : null}
      {parentSummary ? (
        <Text style={styles.source} numberOfLines={2}>
          {CONTENT_PARENT_LABEL}：{parentSummary}
        </Text>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    gap: 4,
  },
  body: { fontSize: 14, color: APP_TEXT_COLOR, lineHeight: 20 },
  source: { fontSize: 12, color: PROFILE_MUTED, lineHeight: 18 },
});
