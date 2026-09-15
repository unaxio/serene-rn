import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { APP_TEXT_COLOR } from '@/constants/Colors';
import { PROFILE_ACCENT, PROFILE_MUTED } from '@/src/features/profile/constants';
import type { ResonateReceivedItem } from '@/src/features/profile/types';
import { formatRelativeTime } from '@/src/features/square/utils/formatRelativeTime';
import { resolveCdnUrl } from '@/src/utils/cdn';

const AVATAR_SIZE = 44;

interface ProfileLikeRowProps {
  item: ResonateReceivedItem;
  onThank: () => void;
}

export function ProfileLikeRow({ item, onThank }: ProfileLikeRowProps) {
  const avatar = resolveCdnUrl(item.fromUser.avatarUrl) ?? item.fromUser.avatarUrl;
  return (
    <View style={styles.row}>
      {avatar ? (
        <Image source={{ uri: avatar }} style={styles.avatar} contentFit="cover" />
      ) : (
        <View style={[styles.avatar, styles.fallback]} />
      )}
      <View style={styles.meta}>
        <Text style={styles.name} numberOfLines={1}>
          {item.fromUser.nickName || '用户'}
        </Text>
        <Text style={styles.summary} numberOfLines={2}>
          {item.content.titleOrSummary || '共鸣了你的内容'}
        </Text>
        <Text style={styles.time}>{formatRelativeTime(item.createdAt)}</Text>
      </View>
      <Pressable style={styles.action} onPress={onThank}>
        <Text style={styles.actionText}>送花感谢</Text>
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
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: '#E2E8F0',
  },
  fallback: { backgroundColor: '#CBD5E1' },
  meta: { flex: 1, gap: 2, minWidth: 0 },
  name: { fontSize: 15, fontWeight: '600', color: APP_TEXT_COLOR },
  summary: { fontSize: 13, color: PROFILE_MUTED, lineHeight: 18 },
  time: { fontSize: 12, color: PROFILE_MUTED },
  action: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: PROFILE_ACCENT,
  },
  actionText: { fontSize: 12, fontWeight: '600', color: '#FFFFFF' },
});
