import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

import { FullScreenModal } from '@/src/components/FullScreenModal';
import { PartnerSearchUserRow } from '@/src/features/soulFlower/components/PartnerSearchUserRow';
import { APP_TEXT_COLOR } from '@/src/features/soulFlower/constants';
import { usePartnerInvites } from '@/src/features/soulFlower/hooks/usePartner';
import { useAuthStore } from '@/src/store/authStore';

interface PartnerInviteModalProps {
  visible: boolean;
  onClose: () => void;
}

const PLACEHOLDER_COLOR = '#94A3B8';

export function PartnerInviteModal({ visible, onClose }: PartnerInviteModalProps) {
  const [nickname, setNickname] = useState('');
  const currentUserId = useAuthStore((state) => state.user?.id);
  const {
    invites,
    isLoading,
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

        {isSearching ? (
          <ActivityIndicator color="#7B6CF9" style={styles.searchStatus} />
        ) : null}

        {!isSearching && hasSearched ? (
          searchResults.length === 0 ? (
            <Text style={styles.empty}>未找到匹配用户</Text>
          ) : (
            <View style={styles.userList}>
              {searchResults.map((user) => (
                <PartnerSearchUserRow
                  key={user.userId}
                  user={user}
                  invited={invitedReceiverIds.has(user.userId)}
                  isSending={isSending}
                  onInvite={() => void sendInvite(user.userId)}
                />
              ))}
            </View>
          )
        ) : null}

        <Text style={[styles.sectionLabel, styles.sectionGap]}>收到的邀请</Text>
        {isLoading ? (
          <ActivityIndicator color="#7B6CF9" />
        ) : receivedPendingInvites.length === 0 ? (
          <Text style={styles.empty}>暂无待处理邀请</Text>
        ) : (
          <View style={styles.inviteList}>
            {receivedPendingInvites.map((invite) => (
              <View key={invite.id} style={styles.inviteCard}>
                <Text style={styles.inviteName}>
                  {invite.senderName || invite.senderId}
                </Text>
                <View style={styles.actions}>
                  <Pressable
                    style={[styles.actionButton, styles.accept]}
                    disabled={isHandling}
                    onPress={() => void respondInvite(invite.id, 'accept')}>
                    <Text style={styles.actionText}>接受</Text>
                  </Pressable>
                  <Pressable
                    style={[styles.actionButton, styles.reject]}
                    disabled={isHandling}
                    onPress={() => void respondInvite(invite.id, 'reject')}>
                    <Text style={styles.actionText}>拒绝</Text>
                  </Pressable>
                </View>
              </View>
            ))}
          </View>
        )}
      </KeyboardAwareScrollView>
    </FullScreenModal>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
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
  searchStatus: {
    marginTop: 16,
  },
  userList: {
    marginTop: 16,
    gap: 12,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 10,
  },
  sectionGap: {
    marginTop: 28,
  },
  empty: {
    color: '#94A3B8',
    fontSize: 14,
    marginTop: 12,
  },
  inviteList: {
    gap: 10,
  },
  inviteCard: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 14,
    gap: 10,
  },
  inviteName: {
    fontSize: 15,
    fontWeight: '600',
    color: APP_TEXT_COLOR,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  accept: {
    backgroundColor: '#22C55E',
  },
  reject: {
    backgroundColor: '#94A3B8',
  },
  actionText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 13,
  },
});
