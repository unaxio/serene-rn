import { useCallback, useEffect, useState } from 'react';
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

interface PartnerInviteModalProps {
  visible: boolean;
  onClose: () => void;
}

const PLACEHOLDER_COLOR = '#94A3B8';

export function PartnerInviteModal({ visible, onClose }: PartnerInviteModalProps) {
  const [nickname, setNickname] = useState('');
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

  const pendingInvites = invites.filter((item) => item.status === 'pending');

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
          <ActivityIndicator color="#2F95DC" style={styles.searchStatus} />
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
                  isSending={isSending}
                  onInvite={() => void sendInvite(user.userId)}
                />
              ))}
            </View>
          )
        ) : null}

        <Text style={[styles.sectionLabel, styles.sectionGap]}>收到的邀请</Text>
        {isLoading ? (
          <ActivityIndicator color="#2F95DC" />
        ) : pendingInvites.length === 0 ? (
          <Text style={styles.empty}>暂无待处理邀请</Text>
        ) : (
          <View style={styles.inviteList}>
            {pendingInvites.map((invite) => (
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
