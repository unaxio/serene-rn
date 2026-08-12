import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { CategoryTabs } from '@/src/features/soulFlower/components/CategoryTabs';
import { MindMapFullModal } from '@/src/features/soulFlower/components/MindMapFullModal';
import { MindMapSectionCard } from '@/src/features/soulFlower/components/MindMapSectionCard';
import {
  APP_TEXT_COLOR,
  MIND_MAP_GRID_COLUMNS,
} from '@/src/features/soulFlower/constants';
import { useMindMap } from '@/src/features/soulFlower/hooks/useMindMap';

const COLUMN_GAP = 8;
const COLUMN_WIDTH_PERCENT = `${100 / MIND_MAP_GRID_COLUMNS}%` as `${number}%`;

/**
 * 可嵌入 ScrollView 的认知图谱区块（非虚拟化列表，避免嵌套滚动冲突）
 */
export function MindMapSection() {
  const [fullModalVisible, setFullModalVisible] = useState(false);
  const {
    categories,
    flowerCards,
    answeredQuestionIds,
    selectedCategoryId,
    setSelectedCategoryId,
    filteredFlowerCards,
    isLoading,
    isError,
    isEmpty,
    refetch,
  } = useMindMap();

  const categoryNameMap = useMemo(() => {
    const map = new Map<string, string>();
    categories.forEach((category) => {
      map.set(category.id, category.name);
    });
    return map;
  }, [categories]);

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#2F95DC" />
        <Text style={styles.hint}>加载认知图谱中...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorTitle}>图谱加载失败</Text>
        <Pressable style={styles.retryButton} onPress={refetch}>
          <Text style={styles.retryText}>重试</Text>
        </Pressable>
      </View>
    );
  }

  if (isEmpty) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyTitle}>暂无认知图谱数据</Text>
        <Text style={styles.hint}>稍后再来探索吧</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>认知图谱</Text>
        <Pressable onPress={() => setFullModalVisible(true)} hitSlop={8}>
          <Text style={styles.moreLink}>查看更多 ›</Text>
        </Pressable>
      </View>

      <CategoryTabs
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        onSelect={setSelectedCategoryId}
      />

      <View style={styles.list}>
        {filteredFlowerCards.length === 0 ? (
          <Text style={styles.emptyTitle}>该分类下暂无花卡</Text>
        ) : (
          <View style={styles.grid}>
            {filteredFlowerCards.map((card) => (
              <View key={card.id} style={styles.gridItem}>
                <MindMapSectionCard
                  card={card}
                  categoryName={categoryNameMap.get(card.categoryId) ?? '未分类'}
                  answeredQuestionIds={answeredQuestionIds}
                />
              </View>
            ))}
          </View>
        )}
      </View>

      <MindMapFullModal
        visible={fullModalVisible}
        onClose={() => setFullModalVisible(false)}
        categories={categories}
        flowerCards={flowerCards}
        answeredQuestionIds={answeredQuestionIds}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 8,
    gap: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: APP_TEXT_COLOR,
  },
  moreLink: {
    fontSize: 13,
    color: '#717BFA',
    fontWeight: '500',
  },
  list: {
    paddingHorizontal: 12,
    paddingBottom: 8,
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
  center: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 40,
    paddingHorizontal: 24,
  },
  hint: {
    fontSize: 14,
    color: '#6B7280',
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#B91C1C',
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
    paddingVertical: 16,
  },
  retryButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#2F95DC',
  },
  retryText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
