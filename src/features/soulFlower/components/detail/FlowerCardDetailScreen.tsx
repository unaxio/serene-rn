import { SymbolView } from 'expo-symbols';
import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AwarenessSummary } from '@/src/features/soulFlower/components/detail/AwarenessSummary';
import { FlowerCardShowcase } from '@/src/features/soulFlower/components/detail/FlowerCardShowcase';
import {
  APP_TEXT_COLOR,
  DEFAULT_THEME_COLOR,
  DETAIL_PAGE_BG,
  FLOWER_THEME_HEX,
} from '@/src/features/soulFlower/constants';
import { useFlowerCardAnswers } from '@/src/features/soulFlower/hooks/useFlowerCardAnswers';
import { useMindMap } from '@/src/features/soulFlower/hooks/useMindMap';
import { findFlowerCardById } from '@/src/features/soulFlower/utils/findFlowerCard';
import { calcFlowerCardProgress } from '@/src/features/soulFlower/utils/progress';

interface FlowerCardDetailScreenProps {
  flowerId: string;
  /** 传入时优先使用，用于弹窗内叠层返回列表 */
  onBack?: () => void;
}

export function FlowerCardDetailScreen({ flowerId, onBack }: FlowerCardDetailScreenProps) {
  const router = useRouter();
  const { flowerCards, categories, answeredQuestionIds, isLoading } = useMindMap();
  const { records, isLoading: isAnswersLoading, isError, refetch } =
    useFlowerCardAnswers(flowerId);

  const card = useMemo(
    () => findFlowerCardById(flowerCards, flowerId),
    [flowerCards, flowerId],
  );
  const categoryName = useMemo(
    () => categories.find((item) => item.id === card?.categoryId)?.name ?? '未分类',
    [categories, card?.categoryId],
  );
  const progress = useMemo(
    () =>
      card
        ? calcFlowerCardProgress(card, answeredQuestionIds)
        : { totalCount: 6, completedCount: 0, progressRatio: 0 },
    [card, answeredQuestionIds],
  );
  const flowerHex =
    FLOWER_THEME_HEX[card?.themeColor ?? DEFAULT_THEME_COLOR] ??
    FLOWER_THEME_HEX[DEFAULT_THEME_COLOR];

  const handleBack = () => {
    if (onBack) {
      onBack();
      return;
    }
    router.back();
  };

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <Pressable onPress={handleBack} hitSlop={12} style={styles.backButton}>
          <SymbolView
            name={{ ios: 'chevron.left', android: 'arrow_back_ios', web: 'arrow_back_ios' }}
            size={22}
            tintColor={APP_TEXT_COLOR}
          />
        </Pressable>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          {!card && !isLoading ? (
            <Text style={styles.empty}>未找到该花卡</Text>
          ) : null}
          {card ? (
            <>
              <FlowerCardShowcase
                card={card}
                categoryName={categoryName}
                progress={progress}
              />
              <AwarenessSummary
                records={records}
                isLoading={isAnswersLoading}
                isError={isError}
                onRetry={() => void refetch()}
                themeColor={card.themeColor}
                flowerHex={flowerHex}
              />
            </>
          ) : null}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: DETAIL_PAGE_BG,
  },
  safe: {
    flex: 1,
    backgroundColor: DETAIL_PAGE_BG,
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    marginTop: 8,
    marginBottom: 12,
  },
  content: {
    paddingBottom: 24,
  },
  empty: {
    textAlign: 'center',
    marginTop: 48,
    color: '#94A3B8',
  },
});
