import { useRouter } from 'expo-router';
import { useCallback } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { APP_TEXT_COLOR } from '@/constants/Colors';
import { PROFILE_MUTED } from '@/src/features/profile/constants';
import type { ProfileCommentItem } from '@/src/features/profile/types';
import { resolveCommentSourceHref } from '@/src/features/profile/utils/resolveCommentSourceHref';
import { COMING_SOON_MESSAGE } from '@/src/features/square/constants';
import { showToast } from '@/src/utils/toast';

interface ProfileCommentRowProps {
  item: ProfileCommentItem;
}

export function ProfileCommentRow({ item }: ProfileCommentRowProps) {
  const router = useRouter();

  const handlePress = useCallback(() => {
    const href = resolveCommentSourceHref(item.source);
    if (!href) {
      showToast(COMING_SOON_MESSAGE);
      return;
    }
    router.push(href);
  }, [item.source, router]);

  return (
    <Pressable style={styles.row} onPress={handlePress}>
      <Text style={styles.body}>{item.content}</Text>
      <Text style={styles.source} numberOfLines={1}>
        {item.source.titleOrSummary}
      </Text>
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
  source: { fontSize: 12, color: PROFILE_MUTED },
});
