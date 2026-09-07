import { FlashList } from '@shopify/flash-list';
import { useQuery } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { FullScreenModal } from '@/src/components/FullScreenModal';
import { APP_TEXT_COLOR } from '@/constants/Colors';
import { AskInviteCopyLink } from '@/src/features/square/components/ask/AskInviteCopyLink';
import { AskInviteUserRow } from '@/src/features/square/components/ask/AskInviteUserRow';
import {
  ACCENT_COLOR,
  ASK_INVITE_EMPTY,
  ASK_INVITE_FOLLOWING_TITLE,
  ASK_INVITE_TITLE,
  CARD_BORDER_COLOR,
  MUTED_TEXT_COLOR,
} from '@/src/features/square/constants';
import { getFollowingList } from '@/src/features/follow/api';
import type { FollowUser } from '@/src/features/follow/types';

interface AskInviteModalProps {
  visible: boolean;
  askId: string;
  onClose: () => void;
}

const DIVIDER_HEIGHT = StyleSheet.hairlineWidth;

export function AskInviteModal({ visible, askId, onClose }: AskInviteModalProps) {
  const [invitedIds, setInvitedIds] = useState<string[]>([]);
  const query = useQuery({
    queryKey: ['follow', 'following'],
    queryFn: getFollowingList,
    enabled: visible,
  });
  const items = query.data ?? [];

  const handleInvite = useCallback((userId: string) => {
    setInvitedIds((prev) => (prev.includes(userId) ? prev : [...prev, userId]));
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: FollowUser }) => (
      <AskInviteUserRow
        user={item}
        invited={invitedIds.includes(item.userId)}
        onInvite={handleInvite}
      />
    ),
    [handleInvite, invitedIds],
  );

  return (
    <FullScreenModal visible={visible} title={ASK_INVITE_TITLE} onBack={onClose}>
      <View style={styles.root}>
        <AskInviteCopyLink askId={askId} />
        <View style={styles.divider} />
        <Text style={styles.section}>{ASK_INVITE_FOLLOWING_TITLE}</Text>
        {query.isLoading ? (
          <ActivityIndicator style={styles.status} color={ACCENT_COLOR} />
        ) : null}
        {query.isError ? <Text style={styles.empty}>好友列表加载失败</Text> : null}
        <FlashList
          data={items}
          renderItem={renderItem}
          keyExtractor={(item) => item.userId}
          ListEmptyComponent={
            query.isLoading || query.isError ? null : (
              <Text style={styles.empty}>{ASK_INVITE_EMPTY}</Text>
            )
          }
        />
      </View>
    </FullScreenModal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: 16,
  },
  divider: {
    height: DIVIDER_HEIGHT,
    backgroundColor: CARD_BORDER_COLOR,
  },
  section: {
    marginTop: 16,
    marginBottom: 8,
    fontSize: 14,
    fontWeight: '700',
    color: APP_TEXT_COLOR,
  },
  status: {
    paddingVertical: 24,
  },
  empty: {
    textAlign: 'center',
    color: MUTED_TEXT_COLOR,
    fontSize: 14,
    paddingVertical: 32,
  },
});
