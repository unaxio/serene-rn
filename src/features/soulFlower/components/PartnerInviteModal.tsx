import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

import { usePartnerInvites } from '@/src/features/soulFlower/hooks/usePartner';

interface PartnerInviteModalProps {
  visible: boolean;
  onClose: () => void;
}

const PLACEHOLDER_COLOR = '#94A3B8';

export function PartnerInviteModal({ visible, onClose }: PartnerInviteModalProps) {
  const [receiverUserId, setReceiverUserId] = useState('');
  const {
    invites,
    isLoading,
    sendInvite,
    respondInvite,
    isSending,
    isHandling,
  } = usePartnerInvites(visible);

  const handleSend = useCallback(async () => {
    await sendInvite(receiverUserId);
    setReceiverUserId('');
  }, [receiverUserId, sendInvite]);

  const pendingInvites = invites.filter((item) => item.status === 'pending');

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>邀请伙伴</Text>
          <Pressable onPress={onClose} hitSlop={12}>
            <Text style={styles.close}>关闭</Text>
          </Pressable>
        </View>

        <KeyboardAwareScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled">
          <Text style={styles.sectionLabel}>发送邀请</Text>
          <TextInput
            style={styles.input}
            value={receiverUserId}
            onChangeText={setReceiverUserId}
            placeholder="输入伙伴用户 ID"
            placeholderTextColor={PLACEHOLDER_COLOR}
            autoCapitalize="none"
            editable={!isSending}
          />
          <Pressable
            style={[styles.primaryButton, isSending && styles.disabled]}
            onPress={handleSend}
            disabled={isSending}>
            {isSending ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.primaryText}>发送邀请</Text>
            )}
          </Pressable>

          <Text style={[styles.sectionLabel, styles.sectionGap]}>收到的邀请</Text>
          {isLoading ? (
            <ActivityIndicator color="#2F95DC" />
          ) : pendingInvites.length === 0 ? (
            <Text style={styles.empty}>暂无待处理邀请</Text>
          ) : (
            <ScrollView style={styles.list}>
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
            </ScrollView>
          )}
        </KeyboardAwareScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E2E8F0',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  close: {
    fontSize: 15,
    color: '#64748B',
  },
  content: {
    padding: 20,
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
  input: {
    height: 46,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 15,
    color: '#0F172A',
    backgroundColor: '#F8FAFC',
    marginBottom: 12,
  },
  primaryButton: {
    height: 46,
    borderRadius: 10,
    backgroundColor: '#2F95DC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.7,
  },
  primaryText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 15,
  },
  empty: {
    color: '#94A3B8',
    fontSize: 14,
  },
  list: {
    maxHeight: 280,
  },
  inviteCard: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    gap: 10,
  },
  inviteName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0F172A',
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
