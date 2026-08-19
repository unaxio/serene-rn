import { Image } from 'expo-image';
import { memo, useCallback, useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { APP_TEXT_COLOR } from '@/src/features/soulFlower/constants';
import type { Category, FlowerCard } from '@/src/features/soulFlower/types';
import { getCategoryUiAssets } from '@/src/features/soulFlower/utils/categoryUi';
import { calcCategoryCompletionStats } from '@/src/features/soulFlower/utils/progress';

interface CategoryTabsProps {
  categories: Category[];
  selectedCategoryId: string | null;
  onSelect: (categoryId: string) => void;
  flowerCards: FlowerCard[];
  answeredQuestionIds: string[];
}

const CATEGORY_CARD_WIDTH = 48;
const CATEGORY_CARD_ASPECT_RATIO = 6 / 7;
const CATEGORY_CARD_RADIUS = 10;
const CATEGORY_ICON_SIZE = 20;
const INACTIVE_BORDER_COLOR = 'rgba(31, 25, 92, 0.08)';
const PROGRESS_SHADOW_COLOR = '#6F72F1';

function CategoryTabsComponent({
  categories,
  selectedCategoryId,
  onSelect,
  flowerCards,
  answeredQuestionIds,
}: CategoryTabsProps) {
  const completionStats = useMemo(
    () => calcCategoryCompletionStats(flowerCards, answeredQuestionIds),
    [answeredQuestionIds, flowerCards],
  );

  const handleSelect = useCallback(
    (categoryId: string) => {
      onSelect(categoryId);
    },
    [onSelect],
  );

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.content}>
      {categories.map((category) => {
        const isActive = category.id === selectedCategoryId;
        const assets = getCategoryUiAssets(category.name);
        const stat = completionStats[category.id];
        const progressLabel = `${stat?.completedCount ?? 0}/${stat?.totalCount ?? 0}`;

        return (
          <Pressable
            key={category.id}
            style={[styles.card, isActive ? styles.cardActive : styles.cardInactive]}
            onPress={() => handleSelect(category.id)}>
            {isActive && assets ? (
              <Image
                source={assets.bgActive}
                style={styles.bg}
                contentFit="cover"
              />
            ) : null}
            <View style={styles.inner}>
              {assets ? (
                <Image
                  source={isActive ? assets.iconActive : assets.icon}
                  style={styles.icon}
                  contentFit="contain"
                />
              ) : null}
              <Text
                style={[styles.label, isActive && styles.labelActive]}
                numberOfLines={1}>
                {category.name}
              </Text>
              <View style={[styles.progressWrap, isActive && styles.progressWrapActive]}>
                <Text
                  style={[styles.progressText, isActive && styles.progressTextActive]}
                  numberOfLines={1}>
                  {progressLabel}
                </Text>
              </View>
            </View>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

export const CategoryTabs = memo(CategoryTabsComponent);

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
    gap: 8,
  },
  card: {
    width: CATEGORY_CARD_WIDTH,
    aspectRatio: CATEGORY_CARD_ASPECT_RATIO,
    borderRadius: CATEGORY_CARD_RADIUS,
    borderWidth: 1,
  },
  cardInactive: {
    backgroundColor: 'transparent',
    borderColor: INACTIVE_BORDER_COLOR,
    overflow: 'hidden',
  },
  cardActive: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    overflow: 'visible',
  },
  bg: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: CATEGORY_CARD_RADIUS,
  },
  inner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    paddingHorizontal: 2,
    paddingVertical: 4,
  },
  icon: {
    width: CATEGORY_ICON_SIZE,
    height: CATEGORY_ICON_SIZE,
  },
  label: {
    fontSize: 9,
    fontWeight: '500',
    color: APP_TEXT_COLOR,
  },
  labelActive: {
    fontWeight: '700',
    color: '#FFFFFF',
  },
  progressWrap: {
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 6,
  },
  progressWrapActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: PROGRESS_SHADOW_COLOR,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 3,
  },
  progressText: {
    fontSize: 8,
    fontWeight: '600',
    color: APP_TEXT_COLOR,
  },
  progressTextActive: {
    color: APP_TEXT_COLOR,
  },
});
