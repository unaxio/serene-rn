import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { APP_TEXT_COLOR } from '@/constants/Colors';
import { PROFILE_MUTED } from '@/src/features/profile/constants';
import type { FlowerSentItem } from '@/src/features/profile/types';
import {
  CONTENT_ORIGIN_LABEL,
  CONTENT_PARENT_LABEL,
  openContentAnchor,
} from '@/src/features/square/utils/contentAnchor';
import { resolveCdnUrl } from '@/src/utils/cdn';

const THUMB_SIZE = 40;

interface ProfileFlowerSentRowProps {
  item: FlowerSentItem;
}

export function ProfileFlowerSentRow({ item }: ProfileFlowerSentRowProps) {
  const router = useRouter();
  const uri = resolveCdnUrl(item.giftFlower.imagePath);
  const originTitle = item.relatedContent?.titleOrSummary?.trim() ?? '';
  const parentSummary = item.relatedContent?.parentSummary?.trim() ?? '';
  const canOpen = Boolean(item.relatedContent?.targetId || item.relatedContent?.rootId);

  const handlePress = useCallback(() => {
    if (!item.relatedContent) {
      return;
    }
    openContentAnchor(router, item.relatedContent);
  }, [item.relatedContent, router]);

  return (
    <Pressable style={styles.row} disabled={!canOpen} onPress={handlePress}>
      <View style={styles.flowerRow}>
        {uri ? (
          <Image source={{ uri }} style={styles.thumb} contentFit="cover" />
        ) : (
          <View style={[styles.thumb, styles.thumbFallback]} />
        )}
        <View style={styles.flex}>
          <Text style={styles.body}>
            送给 {item.receiver.nickName} · {item.giftFlower.name} ×{item.quantity}
          </Text>
          {item.message ? <Text style={styles.muted}>{item.message}</Text> : null}
          {originTitle ? (
            <Text style={styles.muted} numberOfLines={2}>
              {CONTENT_ORIGIN_LABEL}：{originTitle}
            </Text>
          ) : null}
          {parentSummary ? (
            <Text style={styles.muted} numberOfLines={2}>
              {CONTENT_PARENT_LABEL}：{parentSummary}
            </Text>
          ) : null}
        </View>
      </View>
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
  muted: { fontSize: 12, color: PROFILE_MUTED, lineHeight: 18 },
  flowerRow: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  thumb: { width: THUMB_SIZE, height: THUMB_SIZE, borderRadius: 8, backgroundColor: '#E2E8F0' },
  thumbFallback: { backgroundColor: '#CBD5E1' },
  flex: { flex: 1, gap: 2 },
});
