import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { APP_TEXT_COLOR } from '@/constants/Colors';
import type { FollowUser } from '@/src/features/follow/types';
import { PROFILE_ACCENT, PROFILE_MUTED } from '@/src/features/profile/constants';

interface ProfileFollowUserRowProps {
  user: FollowUser;
  actionLabel: string;
  actionPrimary: boolean;
  actionDisabled: boolean;
  onPressUser: () => void;
  onPressAction: () => void;
}

function resolveAvatar(user: FollowUser): string | null {
  return user.avatarUrl || user.avatarPath || user.avatar || null;
}

function displayName(user: FollowUser): string {
  return user.nickName?.trim() || user.username?.trim() || '用户';
}

export function ProfileFollowUserRow({
  user,
  actionLabel,
  actionPrimary,
  actionDisabled,
  onPressUser,
  onPressAction,
}: ProfileFollowUserRowProps) {
  const avatar = resolveAvatar(user);

  return (
    <View style={styles.row}>
      <Pressable style={styles.user} onPress={onPressUser}>
        {avatar ? (
          <Image source={{ uri: avatar }} style={styles.avatar} contentFit="cover" />
        ) : (
          <View style={[styles.avatar, styles.avatarFallback]} />
        )}
        <Text style={styles.name} numberOfLines={1}>
          {displayName(user)}
        </Text>
      </Pressable>
      <Pressable
        style={[styles.action, actionPrimary ? styles.actionPrimary : styles.actionMuted]}
        disabled={actionDisabled}
        onPress={onPressAction}>
        <Text
          style={[
            styles.actionText,
            actionPrimary ? styles.actionTextPrimary : styles.actionTextMuted,
          ]}>
          {actionLabel}
        </Text>
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
  user: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10, minWidth: 0 },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#E2E8F0' },
  avatarFallback: { backgroundColor: '#CBD5E1' },
  name: { flex: 1, fontSize: 15, fontWeight: '600', color: APP_TEXT_COLOR },
  action: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 14 },
  actionPrimary: { backgroundColor: PROFILE_ACCENT },
  actionMuted: { backgroundColor: '#E2E8F0' },
  actionText: { fontSize: 13, fontWeight: '600' },
  actionTextPrimary: { color: '#FFFFFF' },
  actionTextMuted: { color: PROFILE_MUTED },
});
