import { Pressable, StyleSheet, Text, View, type GestureResponderEvent } from 'react-native';

import { APP_TEXT_COLOR } from '@/constants/Colors';
import { ConnectAvatar } from '@/src/features/connect/components/ConnectAvatar';
import { PARTNER_INVITE_REJECT_LABEL } from '@/src/features/connect/constants';
import type { ConnectNotification } from '@/src/features/connect/types';
import {
  canRespondPartnerInvite,
  settledPartnerInviteLabel,
} from '@/src/features/connect/utils/partnerInviteNotice';
import { ACCENT_COLOR, MUTED_TEXT_COLOR } from '@/src/features/square/constants';
import { formatRelativeTime } from '@/src/features/square/utils/formatRelativeTime';

interface ConnectNotificationRowProps {
  item: ConnectNotification;
  onPress: (item: ConnectNotification) => void;
  onAction: (item: ConnectNotification) => void;
  onReject?: (item: ConnectNotification) => void;
}

const AVATAR_SIZE = 40;
const DOT_SIZE = 8;
const PARTNER_INVITE_ACCEPT_LABEL = '同意';

function actionText(item: ConnectNotification): string | null {
  if (item.actionLabel) {
    return item.actionLabel;
  }
  if (item.category === 'follow-visit' && item.extra?.event === 'follow') {
    const relation = item.extra.relation;
    return relation === 'following' || relation === 'mutual' ? '已关注' : '关注';
  }
  return null;
}

function stopRowPress(event: GestureResponderEvent): void {
  event.stopPropagation();
}

export function ConnectNotificationRow({
  item,
  onPress,
  onAction,
  onReject,
}: ConnectNotificationRowProps) {
  const label = actionText(item);
  const showPartnerActions = canRespondPartnerInvite(item);
  const settledLabel = settledPartnerInviteLabel(item);
  return (
    <Pressable style={styles.row} onPress={() => onPress(item)}>
      <ConnectAvatar
        uri={item.actor?.avatarUrl ?? null}
        name={item.actor?.nickName ?? item.title}
        size={AVATAR_SIZE}
      />
      <View style={styles.body}>
        <Text style={styles.title}>{item.actor?.nickName ?? item.title}</Text>
        <Text style={styles.bodyText}>{item.body}</Text>
        {item.summary ? <Text style={styles.summary}>{item.summary}</Text> : null}
        <Text style={styles.time}>{formatRelativeTime(item.createdAt)}</Text>
      </View>
      {showPartnerActions ? (
        <View style={styles.actions}>
          <Pressable
            style={styles.action}
            onPress={(event) => {
              stopRowPress(event);
              onAction(item);
            }}>
            <Text style={styles.actionText}>{label || PARTNER_INVITE_ACCEPT_LABEL}</Text>
          </Pressable>
          <Pressable
            style={styles.reject}
            onPress={(event) => {
              stopRowPress(event);
              onReject?.(item);
            }}>
            <Text style={styles.rejectText}>{PARTNER_INVITE_REJECT_LABEL}</Text>
          </Pressable>
        </View>
      ) : settledLabel ? (
        <Text style={styles.status}>{settledLabel}</Text>
      ) : label ? (
        <Pressable
          style={styles.action}
          onPress={(event) => {
            stopRowPress(event);
            onAction(item);
          }}>
          <Text style={styles.actionText}>{label}</Text>
        </Pressable>
      ) : null}
      {!item.isRead ? <View style={styles.dot} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 10,
    padding: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E2E8F0',
  },
  body: { flex: 1, gap: 4 },
  title: { fontSize: 15, fontWeight: '600', color: APP_TEXT_COLOR },
  bodyText: { fontSize: 14, color: APP_TEXT_COLOR },
  summary: { fontSize: 12, color: MUTED_TEXT_COLOR },
  time: { fontSize: 11, color: MUTED_TEXT_COLOR },
  actions: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  action: {
    alignSelf: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: '#F5F3FF',
  },
  actionText: { color: ACCENT_COLOR, fontSize: 12, fontWeight: '600' },
  reject: {
    alignSelf: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
  },
  rejectText: { color: MUTED_TEXT_COLOR, fontSize: 12, fontWeight: '600' },
  status: {
    alignSelf: 'center',
    fontSize: 12,
    fontWeight: '600',
    color: MUTED_TEXT_COLOR,
  },
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    backgroundColor: '#EF4444',
    marginTop: 6,
  },
});
