import { StyleSheet, Text, View } from 'react-native';

import { FlowerImage } from '@/src/features/soulFlower/components/FlowerImage';
import { PetalProgress } from '@/src/features/soulFlower/components/PetalProgress';
import {
  DEFAULT_FLOWER_NAME,
  LIGHTED_PEOPLE_LABEL,
  THEME_COLOR_STYLES,
  DEFAULT_THEME_COLOR,
} from '@/src/features/soulFlower/constants';
import type { FlowerCard, FlowerCardProgress } from '@/src/features/soulFlower/types';

interface CurrentFlowerCardProps {
  flowerCard: FlowerCard | null;
  progress: FlowerCardProgress;
}

export function CurrentFlowerCard({ flowerCard, progress }: CurrentFlowerCardProps) {
  const theme =
    THEME_COLOR_STYLES[flowerCard?.themeColor ?? DEFAULT_THEME_COLOR] ??
    THEME_COLOR_STYLES[DEFAULT_THEME_COLOR];

  const title = flowerCard
    ? `${flowerCard.flowerName} · ${flowerCard.language}`
    : DEFAULT_FLOWER_NAME;

  return (
    <View style={styles.card}>
      <Text style={styles.title} numberOfLines={2}>
        {title}
      </Text>
      <Text style={styles.lighted}>{LIGHTED_PEOPLE_LABEL}</Text>

      <FlowerImage
        flowerImageUrl={flowerCard?.flowerImageUrl}
        size={110}
        locked={progress.completedCount === 0}
      />

      <PetalProgress
        completedCount={progress.completedCount}
        totalCount={progress.totalCount}
        accentColor={theme.accent}
      />

      <Text style={styles.footer}>完成觉察更新花卡成长状态。</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 8,
    minHeight: 280,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    lineHeight: 20,
  },
  lighted: {
    fontSize: 11,
    color: '#94A3B8',
  },
  footer: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
});
