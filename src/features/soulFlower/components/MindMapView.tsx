import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { CategoryTabs } from '@/src/features/soulFlower/components/CategoryTabs';
import { FlowerCardItem } from '@/src/features/soulFlower/components/FlowerCardItem';
import { useMindMap } from '@/src/features/soulFlower/hooks/useMindMap';

/**
 * 独立图谱页（若仍需）；Overview 请使用 MindMapSection。
 */
export function MindMapView() {
  const {
    categories,
    answeredQuestionIds,
    flowerCards,
    selectedCategoryId,
    setSelectedCategoryId,
    filteredFlowerCards,
    isLoading,
    isError,
    isEmpty,
    refetch,
  } = useMindMap();

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#7B6CF9" />
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
      <CategoryTabs
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        onSelect={setSelectedCategoryId}
        flowerCards={flowerCards}
        answeredQuestionIds={answeredQuestionIds}
      />

      <View style={styles.listContent}>
        {filteredFlowerCards.length === 0 ? (
          <View style={styles.center}>
            <Text style={styles.emptyTitle}>该分类下暂无花卡</Text>
          </View>
        ) : (
          filteredFlowerCards.map((card) => (
            <FlowerCardItem
              key={card.id}
              card={card}
              answeredQuestionIds={answeredQuestionIds}
            />
          ))
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 8,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
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
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  retryButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#7B6CF9',
  },
  retryText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
