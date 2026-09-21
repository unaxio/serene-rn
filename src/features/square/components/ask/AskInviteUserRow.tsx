import { Pressable, StyleSheet, Text, View } from 'react-native';

import { APP_TEXT_COLOR } from '@/constants/Colors';
import { SquareUserAvatar } from '@/src/features/square/components/SquareUserAvatar';
import {
  ACCENT_COLOR,
  ASK_INVITE_ACTION,
  ASK_INVITE_DONE,
  MUTED_TEXT_COLOR,
} from '@/src/features/square/constants';
import type { FollowUser } from '@/src/features/follow/types';

interface AskInviteUserRowProps {
  user: FollowUser;
  invited: boolean;
  inviting: boolean;
  onInvite: (userId: string) => void;
}

const AVATAR_SIZE = 40;

export function AskInviteUserRow({ user, invited, inviting, onInvite }: AskInviteUserRowProps) {
  return (
    <View style={styles.row}>
      <SquareUserAvatar
        author={{
          id: user.userId,
          nickName: user.nickName ?? '',
          avatarUrl: user.avatarUrl ?? user.avatarPath ?? user.avatar ?? '',
        }}
        size={AVATAR_SIZE}
      />
      <Text style={styles.name} numberOfLines={1}>
        {user.nickName || user.username || '用户'}
      </Text>
      <Pressable
        style={[styles.invite, (invited || inviting) && styles.inviteDisabled]}
        disabled={invited || inviting}
        onPress={() => onInvite(user.userId)}>
        <Text style={[styles.inviteText, invited && styles.inviteTextDisabled]}>
          {invited ? ASK_INVITE_DONE : ASK_INVITE_ACTION}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
  },
  name: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: APP_TEXT_COLOR,
  },
  invite: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: ACCENT_COLOR,
  },
  inviteDisabled: {
    backgroundColor: '#E2E8F0',
  },
  inviteText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  inviteTextDisabled: {
    color: MUTED_TEXT_COLOR,
  },
});
