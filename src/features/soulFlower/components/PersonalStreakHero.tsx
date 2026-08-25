import { StyleSheet, Text, View } from 'react-native';

import { APP_TEXT_COLOR } from '@/src/features/soulFlower/constants';

interface PersonalStreakHeroProps {
  streakDays: number;
  todayAnswered: boolean;
}

const TAB_TEXT_COLOR = '#3612dd';
const TAB_BG_COLOR = '#efedfd';
const INCOMPLETE_TEXT_COLOR = '#94A3B8';
const STREAK_NUMBER_SIZE = 110;
const DAY_UNIT_SIZE = 24;
const BADGE_HEIGHT = 22;
const BADGE_FONT_SIZE = 12;

export function PersonalStreakHero({
  streakDays,
  todayAnswered,
}: PersonalStreakHeroProps) {
  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.streakRow}>
          <Text style={styles.streakNumber}>{streakDays}</Text>
          <Text style={styles.dayUnit}>天</Text>
        </View>
        <View
          style={[
            styles.badge,
            todayAnswered ? styles.badgeDone : styles.badgeTodo,
          ]}>
          <Text
            style={[
              styles.badgeText,
              todayAnswered ? styles.badgeTextDone : styles.badgeTextTodo,
            ]}>
            {todayAnswered ? '今日已完成' : '今日未完成'}
          </Text>
        </View>
      </View>

      <Text style={styles.hint}>
        {todayAnswered
          ? `连续${streakDays}天，觉察已经慢慢成为你的节奏`
          : '今天还没觉察，去完成今日觉察吧'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  streakRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  streakNumber: {
    fontSize: STREAK_NUMBER_SIZE,
    lineHeight: STREAK_NUMBER_SIZE,
    fontWeight: '700',
    color: TAB_TEXT_COLOR,
    includeFontPadding: false,
  },
  dayUnit: {
    fontSize: DAY_UNIT_SIZE,
    lineHeight: DAY_UNIT_SIZE,
    fontWeight: '600',
    color: APP_TEXT_COLOR,
    marginLeft: 4,
    paddingBottom: 14,
  },
  badge: {
    height: BADGE_HEIGHT,
    marginTop: 12,
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
    fontSize: BADGE_FONT_SIZE,
    fontWeight: '600',
  },
  badgeTextDone: {
    color: TAB_TEXT_COLOR,
  },
  badgeTextTodo: {
    color: INCOMPLETE_TEXT_COLOR,
  },
  hint: {
    marginTop: 4,
    fontSize: 14,
    lineHeight: 22,
    color: APP_TEXT_COLOR,
  },
});
