import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';

import { APP_TEXT_COLOR } from '@/src/features/soulFlower/constants';
import {
  STREAK_GOAL_DAYS,
  STREAK_GOAL_MARKERS,
  clampStreakProgress,
  formatStreakEncouragement,
} from '@/src/features/soulFlower/utils/personalStreakCopy';
import {
  STREAK_PROGRESS_BLUE,
  STREAK_PROGRESS_RED,
  getStreakProgressGradient,
} from '@/src/features/soulFlower/utils/streakProgressGradient';

interface PersonalGoalProgressProps {
  streakDays: number;
}

const PROGRESS_BAR_HEIGHT = 4;
const PROGRESS_BAR_RADIUS = 2;
const PROGRESS_TRACK_COLOR = '#E8E8EE';
const DIVIDER_COLOR = '#F1F5F9';
const MARKER_FONT_SIZE = 12;

export function PersonalGoalProgress({ streakDays }: PersonalGoalProgressProps) {
  const clampedDays = clampStreakProgress(streakDays);
  const progressRatio = clampedDays / STREAK_GOAL_DAYS;
  const gradient = getStreakProgressGradient(progressRatio);
  const encouragement = formatStreakEncouragement(streakDays);

  return (
    <View style={styles.container}>
      <View style={styles.divider} />

      <View style={styles.headerRow}>
        <Text style={styles.title}>连续目标</Text>
        <Text style={styles.progressLabel}>
          {clampedDays}/{STREAK_GOAL_DAYS}天
        </Text>
      </View>

      <View style={styles.track}>
        {progressRatio > 0 ? (
          <LinearGradient
            colors={gradient.colors}
            locations={gradient.locations}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={[styles.fill, { width: `${progressRatio * 100}%` }]}
          />
        ) : null}
      </View>

      <View style={styles.markersRow}>
        {STREAK_GOAL_MARKERS.map((marker) => (
          <Text
            key={marker}
            style={[
              styles.marker,
              { left: `${(marker / STREAK_GOAL_DAYS) * 100}%` },
            ]}>
            {marker}
          </Text>
        ))}
      </View>

      {encouragement ? (
        <Text style={styles.encourage}>
          {encouragement.prefix}
          <Text style={styles.weeks}>{encouragement.weeksLabel}</Text>
          {encouragement.middle}
          <Text style={styles.praise}>{encouragement.praise}</Text>
          {encouragement.suffix}
        </Text>
      ) : (
        <Text style={styles.encourage}>每一步觉察，都在靠近更好的自己</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: DIVIDER_COLOR,
    marginBottom: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: APP_TEXT_COLOR,
  },
  progressLabel: {
    fontSize: 13,
    color: '#64748B',
  },
  track: {
    height: PROGRESS_BAR_HEIGHT,
    borderRadius: PROGRESS_BAR_RADIUS,
    backgroundColor: PROGRESS_TRACK_COLOR,
    overflow: 'hidden',
  },
  fill: {
    height: PROGRESS_BAR_HEIGHT,
    borderRadius: PROGRESS_BAR_RADIUS,
  },
  markersRow: {
    position: 'relative',
    height: 20,
    marginTop: 8,
  },
  marker: {
    position: 'absolute',
    fontSize: MARKER_FONT_SIZE,
    color: '#94A3B8',
    transform: [{ translateX: -8 }],
  },
  encourage: {
    marginTop: 10,
    fontSize: 13,
    lineHeight: 20,
    color: APP_TEXT_COLOR,
  },
  weeks: {
    color: STREAK_PROGRESS_BLUE,
    fontWeight: '600',
  },
  praise: {
    color: STREAK_PROGRESS_RED,
    fontWeight: '600',
  },
});
