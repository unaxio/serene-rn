import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { FollowUser } from '@/src/features/follow/types';
import { APP_TEXT_COLOR } from '@/src/features/soulFlower/constants';
import { resolveCdnUrl } from '@/src/utils/cdn';

interface PartnerSearchUserRowProps {
  user: FollowUser;
  invited: boolean;
  isSending: boolean;
  onInvite: () => void;
}

const AVATAR_SIZE = 40;
const INVITE_BTN_BG = '#efedfd';
const INVITE_BTN_TEXT = '#3612dd';
const INVITE_SENT_BG = '#E2E8F0';
const INVITE_SENT_TEXT = '#94A3B8';
const INVITE_BTN_HEIGHT = 32;
const INVITE_LABEL = '邀请';
const INVITE_SENT_LABEL = '已发送邀请';

export function PartnerSearchUserRow({
  user,
  invited,
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
        style={[styles.inviteButton, invited && styles.inviteButtonSent]}
        disabled={invited || isSending}
        onPress={onInvite}>
        <Text style={[styles.inviteButtonText, invited && styles.inviteButtonTextSent]}>
          {invited ? INVITE_SENT_LABEL : INVITE_LABEL}
        </Text>
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
  inviteButtonSent: {
    backgroundColor: INVITE_SENT_BG,
  },
  inviteButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: INVITE_BTN_TEXT,
  },
  inviteButtonTextSent: {
    color: INVITE_SENT_TEXT,
  },
});
