import { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, TextInput } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

import { FullScreenModal } from '@/src/components/FullScreenModal';
import { PartnerInviteInbox } from '@/src/features/soulFlower/components/PartnerInviteInbox';
import { PartnerInviteUserList } from '@/src/features/soulFlower/components/PartnerInviteUserList';
import { APP_TEXT_COLOR } from '@/src/features/soulFlower/constants';
import { usePartnerInvites } from '@/src/features/soulFlower/hooks/usePartner';
import type { PartnerInviteAction } from '@/src/features/soulFlower/types';
import { useAuthStore } from '@/src/store/authStore';

interface PartnerInviteModalProps {
  visible: boolean;
  onClose: () => void;
}

const PLACEHOLDER_COLOR = '#94A3B8';
const SEARCH_EMPTY = '未找到匹配用户';
const FOLLOWING_EMPTY = '暂无关注的人';
const FOLLOWING_ERROR = '关注列表加载失败，点击重试';

export function PartnerInviteModal({ visible, onClose }: PartnerInviteModalProps) {
  const [nickname, setNickname] = useState('');
  const currentUserId = useAuthStore((state) => state.user?.id);
  const {
    invites,
    isLoading,
    following,
    isFollowingLoading,
    isFollowingError,
    refetchFollowing,
    searchResults,
    hasSearched,
    searchByNickname,
    resetSearch,
    sendInvite,
    respondInvite,
    isSearching,
    isSending,
    isHandling,
    sentReceiverIds,
  } = usePartnerInvites(visible);

  useEffect(() => {
    if (!visible) {
      setNickname('');
      resetSearch();
    }
  }, [resetSearch, visible]);

  const handleSearchSubmit = useCallback(() => {
    void searchByNickname(nickname);
  }, [nickname, searchByNickname]);

  const handleInvite = useCallback(
    (userId: string) => {
      void sendInvite(userId);
    },
    [sendInvite],
  );

  const handleRespond = useCallback(
    (inviteId: string, action: PartnerInviteAction) => {
      void respondInvite(inviteId, action);
    },
    [respondInvite],
  );

  const handleRetryFollowing = useCallback(() => {
    void refetchFollowing();
  }, [refetchFollowing]);

  const invitedReceiverIds = useMemo(() => {
    const ids = new Set(sentReceiverIds);
    if (!currentUserId) {
      return ids;
    }
    for (const invite of invites) {
      if (invite.status === 'pending' && invite.senderId === currentUserId) {
        ids.add(invite.receiverId);
      }
    }
    return ids;
  }, [currentUserId, invites, sentReceiverIds]);

  const receivedPendingInvites = useMemo(
    () =>
      invites.filter(
        (item) =>
          item.status === 'pending' &&
          Boolean(currentUserId) &&
          item.receiverId === currentUserId,
      ),
    [currentUserId, invites],
  );

  return (
    <FullScreenModal visible={visible} title="邀请伙伴" onBack={onClose}>
      <KeyboardAwareScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled">
        <TextInput
          style={styles.searchInput}
          value={nickname}
          onChangeText={setNickname}
          placeholder="输入昵称，回车搜索"
          placeholderTextColor={PLACEHOLDER_COLOR}
          autoCapitalize="none"
          returnKeyType="search"
          onSubmitEditing={handleSearchSubmit}
          editable={!isSearching}
        />
        <PartnerInviteUserList
          users={hasSearched ? searchResults : following}
          invitedIds={invitedReceiverIds}
          isLoading={hasSearched ? isSearching : isFollowingLoading}
          isError={!hasSearched && isFollowingError}
          isSending={isSending}
          emptyMessage={hasSearched ? SEARCH_EMPTY : FOLLOWING_EMPTY}
          errorMessage={FOLLOWING_ERROR}
          onRetry={hasSearched ? undefined : handleRetryFollowing}
          onInvite={handleInvite}
        />
        <PartnerInviteInbox
          invites={receivedPendingInvites}
          isLoading={isLoading}
          isHandling={isHandling}
          onRespond={handleRespond}
        />
      </KeyboardAwareScrollView>
    </FullScreenModal>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },
  searchInput: {
    height: 46,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 15,
    color: APP_TEXT_COLOR,
    backgroundColor: '#F8FAFC',
  },
});
