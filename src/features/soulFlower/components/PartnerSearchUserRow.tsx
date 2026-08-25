import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { FollowUser } from '@/src/features/follow/types';
import { APP_TEXT_COLOR } from '@/src/features/soulFlower/constants';
import { resolveCdnUrl } from '@/src/utils/cdn';

interface PartnerSearchUserRowProps {
  user: FollowUser;
  isSending: boolean;
  onInvite: () => void;
}

const AVATAR_SIZE = 40;
const INVITE_BTN_BG = '#efedfd';
const INVITE_BTN_TEXT = '#3612dd';
const INVITE_BTN_HEIGHT = 32;

export function PartnerSearchUserRow({
  user,
  isSending,
  onInvite,
}: PartnerSearchUserRowProps) {
  const displayName = user.nickName || user.username || user.userId;
  const avatarUri = resolveCdnUrl(
    user.avatarUrl ?? user.avatarPath ?? user.avatar,
  );

  return (
    <View style={styles.userRow}>
      {avatarUri ? (
        <Image source={{ uri: avatarUri }} style={styles.avatar} contentFit="cover" />
      ) : (
        <View style={[styles.avatar, styles.avatarPlaceholder]}>
          <Text style={styles.avatarFallback}>{displayName.slice(0, 1)}</Text>
        </View>
      )}
      <Text style={styles.userName} numberOfLines={1}>
        {displayName}
      </Text>
      <Pressable
        style={[styles.inviteButton, isSending && styles.disabled]}
        disabled={isSending}
        onPress={onInvite}>
        <Text style={styles.inviteButtonText}>邀请</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: '#E2E8F0',
  },
  avatarPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarFallback: {
    fontSize: 16,
    fontWeight: '600',
    color: APP_TEXT_COLOR,
  },
  userName: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: APP_TEXT_COLOR,
  },
  inviteButton: {
    height: INVITE_BTN_HEIGHT,
    paddingHorizontal: 16,
    borderRadius: INVITE_BTN_HEIGHT / 2,
    backgroundColor: INVITE_BTN_BG,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inviteButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: INVITE_BTN_TEXT,
  },
  disabled: {
    opacity: 0.7,
  },
});
