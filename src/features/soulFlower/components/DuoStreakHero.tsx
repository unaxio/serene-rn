import { StyleSheet, Text, View } from 'react-native';

import { APP_TEXT_COLOR } from '@/src/features/soulFlower/constants';

interface DuoStreakHeroProps {
  streakDays: number;
}

const TAB_TEXT_COLOR = '#3612dd';
const STREAK_NUMBER_SIZE = 110;
const DAY_UNIT_SIZE = 24;

export function DuoStreakHero({ streakDays }: DuoStreakHeroProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>共同连续</Text>
      <View style={styles.streakRow}>
        <Text style={styles.streakNumber}>{streakDays}</Text>
        <Text style={styles.dayUnit}>天</Text>
      </View>
      <Text style={styles.hint}>有人同行，每一次坚持都有了回应</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: TAB_TEXT_COLOR,
    marginBottom: 2,
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
  hint: {
    marginTop: 4,
    fontSize: 14,
    lineHeight: 22,
    color: APP_TEXT_COLOR,
  },
});
