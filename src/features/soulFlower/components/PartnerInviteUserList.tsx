import { useCallback } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import type { FollowUser } from '@/src/features/follow/types';
import { PartnerSearchUserRow } from '@/src/features/soulFlower/components/PartnerSearchUserRow';

interface PartnerInviteUserListProps {
  users: FollowUser[];
  invitedIds: ReadonlySet<string>;
  isLoading: boolean;
  isError: boolean;
  isSending: boolean;
  emptyMessage: string;
  errorMessage: string;
  onRetry?: () => void;
  onInvite: (userId: string) => void;
}

const LIST_ACCENT = '#7B6CF9';

export function PartnerInviteUserList({
  users,
  invitedIds,
  isLoading,
  isError,
  isSending,
  emptyMessage,
  errorMessage,
  onRetry,
  onInvite,
}: PartnerInviteUserListProps) {
  const handleRetry = useCallback(() => {
    onRetry?.();
  }, [onRetry]);

  if (isLoading) {
    return <ActivityIndicator color={LIST_ACCENT} style={styles.status} />;
  }
  if (isError) {
    return (
      <Pressable onPress={handleRetry} disabled={!onRetry}>
        <Text style={styles.empty}>{errorMessage}</Text>
      </Pressable>
    );
  }
  if (users.length === 0) {
    return <Text style={styles.empty}>{emptyMessage}</Text>;
  }
  return (
    <View style={styles.list}>
      {users.map((user) => (
        <PartnerSearchUserRow
          key={user.userId}
          user={user}
          invited={invitedIds.has(user.userId)}
          isSending={isSending}
          onInvite={onInvite}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  status: {
    marginTop: 16,
  },
  list: {
    marginTop: 16,
    gap: 12,
  },
  empty: {
    color: '#94A3B8',
    fontSize: 14,
    marginTop: 12,
  },
});
