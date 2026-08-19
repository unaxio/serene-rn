import { Image } from 'expo-image';
import { memo, useCallback } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { APP_TEXT_COLOR } from '@/src/features/soulFlower/constants';
import type { Category } from '@/src/features/soulFlower/types';
import { getCategoryUiAssets } from '@/src/features/soulFlower/utils/categoryUi';

interface CategoryTabsProps {
  categories: Category[];
  selectedCategoryId: string | null;
  onSelect: (categoryId: string) => void;
}

const CATEGORY_CARD_WIDTH = 52;
const CATEGORY_CARD_ASPECT_RATIO = 6 / 7;
const CATEGORY_CARD_RADIUS = 10;
const CATEGORY_ICON_SIZE = 26;
const INACTIVE_BORDER_COLOR = 'rgba(31, 25, 92, 0.08)';

function CategoryTabsComponent({
  categories,
  selectedCategoryId,
  onSelect,
}: CategoryTabsProps) {
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
    overflow: 'hidden',
  },
  cardInactive: {
    backgroundColor: 'transparent',
    borderColor: INACTIVE_BORDER_COLOR,
  },
  cardActive: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  bg: {
    ...StyleSheet.absoluteFillObject,
  },
  inner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingHorizontal: 2,
  },
  icon: {
    width: CATEGORY_ICON_SIZE,
    height: CATEGORY_ICON_SIZE,
  },
  label: {
    fontSize: 10,
    fontWeight: '500',
    color: APP_TEXT_COLOR,
  },
  labelActive: {
    fontWeight: '700',
  },
});
