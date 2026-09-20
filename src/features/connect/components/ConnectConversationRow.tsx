import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';

import { APP_TEXT_COLOR } from '@/constants/Colors';
import { ConnectAvatar } from '@/src/features/connect/components/ConnectAvatar';
import { ConnectBadge } from '@/src/features/connect/components/ConnectBadge';
import type { ConnectConversation } from '@/src/features/connect/types';
import { MUTED_TEXT_COLOR } from '@/src/features/square/constants';
import { formatRelativeTime } from '@/src/features/square/utils/formatRelativeTime';

interface ConnectConversationRowProps {
  item: ConnectConversation;
  onPress: (item: ConnectConversation) => void;
  onPin: (item: ConnectConversation) => void;
  onDelete: (item: ConnectConversation) => void;
}

const AVATAR_SIZE = 48;
const ACTION_WIDTH = 72;
const PIN_COLOR = '#7B6CF9';
const DELETE_COLOR = '#DC2626';

export function ConnectConversationRow({
  item,
  onPress,
  onPin,
  onDelete,
}: ConnectConversationRowProps) {
  return (
    <Swipeable
      overshootRight={false}
      renderRightActions={() => (
        <View style={styles.actions}>
          {item.kind === 'dm' ? (
            <Pressable style={[styles.action, styles.pin]} onPress={() => onPin(item)}>
              <Text style={styles.actionText}>{item.pinned ? '取消' : '置顶'}</Text>
            </Pressable>
          ) : null}
          <Pressable style={[styles.action, styles.delete]} onPress={() => onDelete(item)}>
            <Text style={styles.actionText}>删除</Text>
          </Pressable>
        </View>
      )}>
      <Pressable style={styles.row} onPress={() => onPress(item)}>
        <ConnectAvatar uri={item.avatarUrl} name={item.title} size={AVATAR_SIZE} />
        <View style={styles.body}>
          <View style={styles.titleLine}>
            <Text style={styles.title} numberOfLines={1}>
              {item.title}
            </Text>
            {item.muted ? (
              <SymbolView
                name={{ ios: 'bell.slash', android: 'notifications_off', web: 'notifications_off' }}
                size={14}
                tintColor={MUTED_TEXT_COLOR}
              />
            ) : null}
          </View>
          <Text style={styles.summary} numberOfLines={1}>
            {item.summary || '暂无消息'}
          </Text>
        </View>
        <View style={styles.meta}>
          <Text style={styles.time}>
            {item.lastMessageAt ? formatRelativeTime(item.lastMessageAt) : ''}
          </Text>
          <ConnectBadge count={item.unreadCount} />
        </View>
      </Pressable>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  body: {
    flex: 1,
    gap: 4,
  },
  titleLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  title: {
    flexShrink: 1,
    fontSize: 16,
    fontWeight: '600',
    color: APP_TEXT_COLOR,
  },
  summary: {
    fontSize: 13,
    color: MUTED_TEXT_COLOR,
  },
  meta: {
    alignItems: 'flex-end',
    gap: 6,
    minWidth: 48,
  },
  time: {
    fontSize: 11,
    color: MUTED_TEXT_COLOR,
  },
  actions: {
    flexDirection: 'row',
  },
  action: {
    width: ACTION_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pin: {
    backgroundColor: PIN_COLOR,
  },
  delete: {
    backgroundColor: DELETE_COLOR,
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
});
