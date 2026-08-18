import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { FullScreenModal } from '@/src/components/FullScreenModal';
import { MindMapFilterTabs } from '@/src/features/soulFlower/components/MindMapFilterTabs';
import { MindMapGridCard } from '@/src/features/soulFlower/components/MindMapGridCard';
import {
  ALL_CATEGORY_ID,
  MIND_MAP_GRID_COLUMNS,
} from '@/src/features/soulFlower/constants';
import { useOpenFlowerCard } from '@/src/features/soulFlower/hooks/useOpenFlowerCard';
import type { Category, FlowerCard } from '@/src/features/soulFlower/types';

interface MindMapFullModalProps {
  visible: boolean;
  onClose: () => void;
  categories: Category[];
  flowerCards: FlowerCard[];
  answeredQuestionIds: string[];
}

export function MindMapFullModal({
  visible,
  onClose,
  categories,
  flowerCards,
  answeredQuestionIds,
}: MindMapFullModalProps) {
  const openFlowerCard = useOpenFlowerCard();
  const [selectedCategoryId, setSelectedCategoryId] = useState(ALL_CATEGORY_ID);

  const categoryNameMap = useMemo(() => {
    const map = new Map<string, string>();
    categories.forEach((category) => {
      map.set(category.id, category.name);
    });
    return map;
  }, [categories]);

  const filteredCards = useMemo(() => {
    if (selectedCategoryId === ALL_CATEGORY_ID) {
      return flowerCards;
    }
    return flowerCards.filter((card) => card.categoryId === selectedCategoryId);
  }, [flowerCards, selectedCategoryId]);

  return (
    <FullScreenModal
      visible={visible}
      title="认知图谱"
      onBack={onClose}
      backgroundColor="#F8FAFC">
      <Text style={styles.subtitle}>每一次觉察，都会让花朵更接近盛放。</Text>

      <View style={styles.tabsWrap}>
        <MindMapFilterTabs
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          onSelect={setSelectedCategoryId}
        />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.gridContent}
        showsVerticalScrollIndicator={false}>
        {filteredCards.length === 0 ? (
          <Text style={styles.empty}>该分类下暂无花卡</Text>
        ) : (
          <View style={styles.grid}>
            {filteredCards.map((card) => (
              <View key={card.id} style={styles.gridItem}>
                <Pressable onPress={() => openFlowerCard(card.id)}>
                  <MindMapGridCard
                    card={card}
                    categoryName={categoryNameMap.get(card.categoryId) ?? '未分类'}
                    answeredQuestionIds={answeredQuestionIds}
                  />
                </Pressable>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </FullScreenModal>
  );
}

const COLUMN_GAP = 8;
const COLUMN_WIDTH_PERCENT = `${100 / MIND_MAP_GRID_COLUMNS}%` as `${number}%`;

const styles = StyleSheet.create({
  subtitle: {
    textAlign: 'center',
    marginBottom: 16,
    paddingHorizontal: 24,
    fontSize: 13,
    color: '#64748B',
  },
  tabsWrap: {
    marginBottom: 12,
  },
  scroll: {
    flex: 1,
  },
  gridContent: {
    paddingHorizontal: 12,
    paddingBottom: 32,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -COLUMN_GAP / 2,
  },
  gridItem: {
    width: COLUMN_WIDTH_PERCENT,
    paddingHorizontal: COLUMN_GAP / 2,
  },
  empty: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 14,
    color: '#94A3B8',
  },
});
