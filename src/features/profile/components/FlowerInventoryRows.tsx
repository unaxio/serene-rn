import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { APP_TEXT_COLOR } from '@/constants/Colors';
import { PROFILE_ACCENT, PROFILE_MUTED } from '@/src/features/profile/constants';
import type { GiftFlowerReceivedItem } from '@/src/features/profile/types';
import type { GiftFlowerInventoryItem } from '@/src/features/square/types';
import { resolveCdnUrl } from '@/src/utils/cdn';

const THUMB = 56;

interface SendableRowProps {
  item: GiftFlowerInventoryItem;
  showReceivedCount?: boolean;
  onSend: () => void;
}

export function FlowerInventorySendableRow({
  item,
  showReceivedCount = false,
  onSend,
}: SendableRowProps) {
  const uri = resolveCdnUrl(item.imagePath) ?? item.imagePath;
  const canSend = item.purchasedCount > 0;
  const countLabel = showReceivedCount
    ? `可用 ${item.purchasedCount} · 获赠 ${item.receivedCount}`
    : `可用 ${item.purchasedCount}`;

  return (
    <View style={styles.row}>
      {uri ? (
        <Image source={{ uri }} style={styles.thumb} contentFit="cover" />
      ) : (
        <View style={[styles.thumb, styles.fallback]} />
      )}
      <View style={styles.meta}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.count}>{countLabel}</Text>
      </View>
      <Pressable
        style={[styles.send, !canSend && styles.sendDisabled]}
        disabled={!canSend}
        onPress={onSend}>
        <Text style={[styles.sendText, !canSend && styles.sendTextDisabled]}>送花</Text>
      </Pressable>
    </View>
  );
}

interface ReceivedRowProps {
  item: GiftFlowerReceivedItem;
}

export function FlowerInventoryReceivedRow({ item }: ReceivedRowProps) {
  const uri = resolveCdnUrl(item.imagePath) ?? item.imagePath;
  return (
    <View style={styles.row}>
      {uri ? (
        <Image source={{ uri }} style={styles.thumb} contentFit="cover" />
      ) : (
        <View style={[styles.thumb, styles.fallback]} />
      )}
      <View style={styles.meta}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.count}>
          获赠 {item.quantity} · 来自 {item.sender.nickName || '用户'}
        </Text>
        <Text style={styles.hint}>获赠不可送</Text>
      </View>
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
  meta: { flex: 1, gap: 2 },
  name: { fontSize: 15, fontWeight: '600', color: APP_TEXT_COLOR },
  count: { fontSize: 12, color: PROFILE_MUTED },
  hint: { fontSize: 12, color: PROFILE_MUTED },
  send: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: PROFILE_ACCENT,
  },
  sendDisabled: {
    backgroundColor: '#E2E8F0',
  },
  sendText: { fontSize: 13, fontWeight: '600', color: '#FFFFFF' },
  sendTextDisabled: { color: PROFILE_MUTED },
});
