import { StyleSheet, Text, View } from 'react-native';

import { FlowerImage } from '@/src/features/soulFlower/components/FlowerImage';
import { PetalProgress } from '@/src/features/soulFlower/components/PetalProgress';
import {
  APP_TEXT_COLOR,
  DEFAULT_FLOWER_NAME,
  LIGHTED_PEOPLE_LABEL,
} from '@/src/features/soulFlower/constants';
import type { FlowerCard, FlowerCardProgress } from '@/src/features/soulFlower/types';
import { getFlowerPhaseImagePath } from '@/src/features/soulFlower/utils/progress';

interface CurrentFlowerCardProps {
  flowerCard: FlowerCard | null;
  progress: FlowerCardProgress;
}

export function CurrentFlowerCard({ flowerCard, progress }: CurrentFlowerCardProps) {
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
        imagePath={getFlowerPhaseImagePath(flowerCard, progress.completedCount)}
        size={110}
        locked={progress.completedCount === 0}
      />

      <PetalProgress
        completedCount={progress.completedCount}
        totalCount={progress.totalCount}
      />

      <Text style={styles.footer}>完成觉察更新花卡成长状态。</Text>
    </View>
  );
}

const CARD_BORDER_COLOR = '#eeeff3';

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: 'transparent',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: CARD_BORDER_COLOR,
    gap: 8,
    minHeight: 280,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: APP_TEXT_COLOR,
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
