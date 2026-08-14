import { SymbolView } from 'expo-symbols';
import { useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MindMapFilterTabs } from '@/src/features/soulFlower/components/MindMapFilterTabs';
import { MindMapGridCard } from '@/src/features/soulFlower/components/MindMapGridCard';
import {
  ALL_CATEGORY_ID,
  APP_TEXT_COLOR,
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
  const insets = useSafeAreaInsets();
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
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}>
      <View style={[styles.container, { paddingTop: Math.max(insets.top, 12) }]}>
        <View style={styles.topBar}>
          <Pressable onPress={onClose} hitSlop={12} style={styles.backButton}>
            <SymbolView
              name={{
                ios: 'chevron.left',
                android: 'arrow_back_ios',
                web: 'arrow_back_ios',
              }}
              size={22}
              tintColor={APP_TEXT_COLOR}
            />
          </Pressable>
        </View>

        <Text style={styles.title}>认知图谱</Text>
        <Text style={styles.subtitle}>每一次觉察，都会让花朵更接近盛放。</Text>

        <View style={styles.tabsWrap}>
          <MindMapFilterTabs
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            onSelect={setSelectedCategoryId}
          />
        </View>

        <ScrollView
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
      </View>
    </Modal>
  );
}

const COLUMN_GAP = 8;
const COLUMN_WIDTH_PERCENT = `${100 / MIND_MAP_GRID_COLUMNS}%` as `${number}%`;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 12,
    marginBottom: 4,
    minHeight: 36,
  },
  backButton: {
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  title: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '700',
    color: APP_TEXT_COLOR,
  },
  subtitle: {
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 16,
    paddingHorizontal: 24,
    fontSize: 13,
    color: '#64748B',
  },
  tabsWrap: {
    marginBottom: 12,
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
