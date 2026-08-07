import { memo, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import {
  DEFAULT_THEME_COLOR,
  THEME_COLOR_STYLES,
} from '@/src/features/soulFlower/constants';
import type { FlowerCard } from '@/src/features/soulFlower/types';
import {
  calcFlowerCardProgress,
  formatProgressLabel,
} from '@/src/features/soulFlower/utils/progress';

interface FlowerCardItemProps {
  card: FlowerCard;
  answeredQuestionIds: string[];
}

function FlowerCardItemComponent({ card, answeredQuestionIds }: FlowerCardItemProps) {
  const theme = THEME_COLOR_STYLES[card.themeColor] ?? THEME_COLOR_STYLES[DEFAULT_THEME_COLOR];

  const { completedCount, totalCount, progressRatio } = useMemo(
    () => calcFlowerCardProgress(card, answeredQuestionIds),
    [card, answeredQuestionIds],
  );

  const progressLabel = formatProgressLabel(completedCount, totalCount);
  const isUnlocked = totalCount > 0 && completedCount === totalCount;

  return (
    <View style={[styles.card, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.flowerName, { color: theme.text }]}>{card.flowerName}</Text>
        {isUnlocked ? (
          <Text style={[styles.badge, { color: theme.accent }]}>已解锁</Text>
        ) : null}
      </View>
      <Text style={[styles.title, { color: theme.text }]} numberOfLines={2}>
        {card.title}
      </Text>
      <View style={styles.progressRow}>
        <View style={[styles.track, { backgroundColor: theme.track }]}>
          <View
            style={[
              styles.fill,
              {
                backgroundColor: theme.accent,
                width: `${Math.min(progressRatio * 100, 100)}%`,
              },
            ]}
          />
        </View>
        <Text style={[styles.progressLabel, { color: theme.text }]}>{progressLabel}</Text>
      </View>
    </View>
  );
}

export const FlowerCardItem = memo(FlowerCardItemComponent);

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  flowerName: {
    fontSize: 18,
    fontWeight: '700',
  },
  badge: {
    fontSize: 12,
    fontWeight: '700',
  },
  title: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.9,
    marginBottom: 14,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  track: {
    flex: 1,
    height: 8,
    borderRadius: 999,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 999,
  },
  progressLabel: {
    fontSize: 13,
    fontWeight: '700',
    minWidth: 40,
    textAlign: 'right',
  },
});
