import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';

import { FlowerImage } from '@/src/features/soulFlower/components/FlowerImage';
import { PetalProgress } from '@/src/features/soulFlower/components/PetalProgress';
import {
  APP_TEXT_COLOR,
  DEFAULT_FLOWER_NAME,
  LIGHTED_PEOPLE_LABEL,
} from '@/src/features/soulFlower/constants';
import { useOpenFlowerCard } from '@/src/features/soulFlower/hooks/useOpenFlowerCard';
import type {
  FlowerCard,
  FlowerCardProgress,
} from '@/src/features/soulFlower/types';
import { getFlowerPhaseImagePath } from '@/src/features/soulFlower/utils/progress';

interface CurrentFlowerCardProps {
  flowerCard: FlowerCard | null;
  progress: FlowerCardProgress;
}

export function CurrentFlowerCard({
  flowerCard,
  progress,
}: CurrentFlowerCardProps) {
  const openFlowerCard = useOpenFlowerCard();
  const isLocked = progress.completedCount === 0;
  const title = flowerCard
    ? `${flowerCard.flowerName} · ${flowerCard.title}`
    : DEFAULT_FLOWER_NAME;

  return (
    <Pressable
      style={styles.card}
      disabled={isLocked || !flowerCard}
      onPress={() => {
        if (flowerCard) {
          openFlowerCard(flowerCard.id);
        }
      }}>
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        <Text style={styles.lighted}>{LIGHTED_PEOPLE_LABEL}</Text>
      </View>

      <View style={styles.imageWrap}>
        <FlowerImage
          imagePath={getFlowerPhaseImagePath(
            flowerCard,
            progress.completedCount,
          )}
          size={FLOWER_IMAGE_SIZE}
          locked={isLocked}
        />
      </View>

      <PetalProgress
        completedCount={progress.completedCount}
        totalCount={progress.totalCount}
      />

      <Text style={styles.footer}>完成觉察更新花卡成长状态。</Text>
    </Pressable>
  );
}

const CARD_BORDER_COLOR = '#eeeff3';
const CARD_GAP = 8;
const IMAGE_VERTICAL_GAP = 10;
const SCREEN_HORIZONTAL_PADDING = 16;
const DUAL_CARD_GAP = 10;
const CARD_INNER_PADDING = 14;
const columnInnerWidth =
  (Dimensions.get('window').width -
    SCREEN_HORIZONTAL_PADDING * 2 -
    DUAL_CARD_GAP) /
    2 -
  CARD_INNER_PADDING * 2;
const FLOWER_IMAGE_SIZE = Math.round(columnInnerWidth);

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: 'transparent',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: CARD_BORDER_COLOR,
    gap: CARD_GAP,
    minHeight: 280,
  },
  header: {
    gap: 4,
  },
  imageWrap: {
    alignItems: 'center',
    marginVertical: IMAGE_VERTICAL_GAP,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: APP_TEXT_COLOR,
    lineHeight: 20,
    textAlign: 'center',
  },
  lighted: {
    fontSize: 11,
    color: '#94A3B8',
    textAlign: 'center',
  },
  footer: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
    textAlign: 'center',
  },
});
