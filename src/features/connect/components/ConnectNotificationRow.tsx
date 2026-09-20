import { Pressable, StyleSheet, Text, View } from 'react-native';

import { APP_TEXT_COLOR } from '@/constants/Colors';
import { ConnectAvatar } from '@/src/features/connect/components/ConnectAvatar';
import type { ConnectNotification } from '@/src/features/connect/types';
import { ACCENT_COLOR, MUTED_TEXT_COLOR } from '@/src/features/square/constants';
import { formatRelativeTime } from '@/src/features/square/utils/formatRelativeTime';

interface ConnectNotificationRowProps {
  item: ConnectNotification;
  onPress: (item: ConnectNotification) => void;
  onAction: (item: ConnectNotification) => void;
}

const AVATAR_SIZE = 40;
const DOT_SIZE = 8;

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

export function ConnectNotificationRow({ item, onPress, onAction }: ConnectNotificationRowProps) {
  const label = actionText(item);
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
      {label ? (
        <Pressable style={styles.action} onPress={() => onAction(item)}>
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
  action: {
    alignSelf: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: '#F5F3FF',
  },
  actionText: { color: ACCENT_COLOR, fontSize: 12, fontWeight: '600' },
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    backgroundColor: '#EF4444',
    marginTop: 6,
  },
});
