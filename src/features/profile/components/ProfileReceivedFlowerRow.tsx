import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { APP_TEXT_COLOR } from '@/constants/Colors';
import { PROFILE_ACCENT, PROFILE_MUTED } from '@/src/features/profile/constants';
import type { FlowerReceivedLedgerItem } from '@/src/features/profile/types';
import { formatRelativeTime } from '@/src/features/square/utils/formatRelativeTime';
import { resolveCdnUrl } from '@/src/utils/cdn';

const THUMB = 52;

interface ProfileReceivedFlowerRowProps {
  item: FlowerReceivedLedgerItem;
  onReply: () => void;
}

export function ProfileReceivedFlowerRow({ item, onReply }: ProfileReceivedFlowerRowProps) {
  const flowerUri =
    resolveCdnUrl(item.giftFlower.imagePath) ?? item.giftFlower.imagePath;
  return (
    <View style={styles.row}>
      {flowerUri ? (
        <Image source={{ uri: flowerUri }} style={styles.thumb} contentFit="cover" />
      ) : (
        <View style={[styles.thumb, styles.fallback]} />
      )}
      <View style={styles.meta}>
        <Text style={styles.title} numberOfLines={1}>
          {item.giftFlower.name} ×{item.quantity}
        </Text>
        <Text style={styles.sender} numberOfLines={1}>
          来自 {item.sender.nickName || '用户'}
        </Text>
        {item.message ? (
          <Text style={styles.message} numberOfLines={2}>
            {item.message}
          </Text>
        ) : null}
        {item.relatedContent ? (
          <Text style={styles.related} numberOfLines={1}>
            相关：{item.relatedContent.titleOrSummary}
          </Text>
        ) : null}
        <Text style={styles.time}>{formatRelativeTime(item.createdAt)}</Text>
      </View>
      <Pressable style={styles.action} onPress={onReply}>
        <Text style={styles.actionText}>回赠</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E2E8F0',
  },
  thumb: { width: THUMB, height: THUMB, borderRadius: 10, backgroundColor: '#E2E8F0' },
  fallback: { backgroundColor: '#CBD5E1' },
  meta: { flex: 1, gap: 2, minWidth: 0 },
  title: { fontSize: 15, fontWeight: '600', color: APP_TEXT_COLOR },
  sender: { fontSize: 13, color: PROFILE_MUTED },
  message: { fontSize: 13, color: APP_TEXT_COLOR },
  related: { fontSize: 12, color: PROFILE_MUTED },
  time: { fontSize: 12, color: PROFILE_MUTED },
  action: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: PROFILE_ACCENT,
  },
  actionText: { fontSize: 13, fontWeight: '600', color: '#FFFFFF' },
});
