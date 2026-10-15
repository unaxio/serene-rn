import { useCallback } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { APP_TEXT_COLOR } from '@/src/features/soulFlower/constants';
import type { PartnerInviteAction, PartnerInviteItem } from '@/src/features/soulFlower/types';

interface PartnerInviteInboxProps {
  invites: PartnerInviteItem[];
  isLoading: boolean;
  isHandling: boolean;
  onRespond: (inviteId: string, action: PartnerInviteAction) => void;
}

const INBOX_TITLE = '收到的邀请';
const INBOX_EMPTY = '暂无待处理邀请';
const INBOX_ACCENT = '#7B6CF9';

export function PartnerInviteInbox({
  invites,
  isLoading,
  isHandling,
  onRespond,
}: PartnerInviteInboxProps) {
  const accept = useCallback(
    (inviteId: string) => {
      onRespond(inviteId, 'accept');
    },
    [onRespond],
  );
  const reject = useCallback(
    (inviteId: string) => {
      onRespond(inviteId, 'reject');
    },
    [onRespond],
  );

  return (
    <View>
      <Text style={styles.sectionLabel}>{INBOX_TITLE}</Text>
      {isLoading ? <ActivityIndicator color={INBOX_ACCENT} /> : null}
      {!isLoading && invites.length === 0 ? <Text style={styles.empty}>{INBOX_EMPTY}</Text> : null}
      {!isLoading && invites.length > 0 ? (
        <View style={styles.inviteList}>
          {invites.map((invite) => (
            <View key={invite.id} style={styles.inviteCard}>
              <Text style={styles.inviteName}>{invite.senderName || invite.senderId}</Text>
              <View style={styles.actions}>
                <Pressable
                  style={[styles.actionButton, styles.accept]}
                  disabled={isHandling}
                  onPress={() => accept(invite.id)}>
                  <Text style={styles.actionText}>接受</Text>
                </Pressable>
                <Pressable
                  style={[styles.actionButton, styles.reject]}
                  disabled={isHandling}
                  onPress={() => reject(invite.id)}>
                  <Text style={styles.actionText}>拒绝</Text>
                </Pressable>
              </View>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
    marginTop: 28,
    marginBottom: 10,
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
