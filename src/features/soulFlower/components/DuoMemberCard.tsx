import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

import { APP_TEXT_COLOR } from '@/src/features/soulFlower/constants';
import { resolveCdnUrl } from '@/src/utils/cdn';

interface DuoMemberCardProps {
  displayName: string;
  avatarUrl?: string | null;
  todayCompleted: boolean;
}

const AVATAR_SIZE = 56;
const BADGE_HEIGHT = 22;
const TAB_TEXT_COLOR = '#3612dd';
const TAB_BG_COLOR = '#efedfd';
const INCOMPLETE_TEXT_COLOR = '#94A3B8';

export function DuoMemberCard({
  displayName,
  avatarUrl,
  todayCompleted,
}: DuoMemberCardProps) {
  const avatarUri = resolveCdnUrl(avatarUrl);
  const initial = displayName.slice(0, 1) || '?';

  return (
    <View style={styles.card}>
      {avatarUri ? (
        <Image source={{ uri: avatarUri }} style={styles.avatar} contentFit="cover" />
      ) : (
        <View style={[styles.avatar, styles.avatarPlaceholder]}>
          <Text style={styles.avatarFallback}>{initial}</Text>
        </View>
      )}
      <Text style={styles.name} numberOfLines={1}>
        {displayName}
      </Text>
      <View
        style={[
          styles.badge,
          todayCompleted ? styles.badgeDone : styles.badgeTodo,
        ]}>
        <Text
          style={[
            styles.badgeText,
            todayCompleted ? styles.badgeTextDone : styles.badgeTextTodo,
          ]}>
          {todayCompleted ? '今日已完成' : '今日待完成'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: '#E2E8F0',
  },
  avatarPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarFallback: {
    fontSize: 20,
    fontWeight: '700',
    color: APP_TEXT_COLOR,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: APP_TEXT_COLOR,
    maxWidth: '100%',
  },
  badge: {
    height: BADGE_HEIGHT,
    paddingHorizontal: 10,
    borderRadius: BADGE_HEIGHT / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeDone: {
    backgroundColor: TAB_BG_COLOR,
  },
  badgeTodo: {
    backgroundColor: '#F1F5F9',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  badgeTextDone: {
    color: TAB_TEXT_COLOR,
  },
  badgeTextTodo: {
    color: INCOMPLETE_TEXT_COLOR,
  },
});
