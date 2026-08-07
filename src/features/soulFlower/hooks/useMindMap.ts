import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';

import { getMindMapFullData } from '@/src/features/soulFlower/api';
import { SOUL_FLOWER_QUERY_KEYS } from '@/src/features/soulFlower/constants';
import type { Category, FlowerCard } from '@/src/features/soulFlower/types';

interface UseMindMapResult {
  categories: Category[];
  flowerCards: FlowerCard[];
  answeredQuestionIds: string[];
  selectedCategoryId: string | null;
  setSelectedCategoryId: (categoryId: string) => void;
  filteredFlowerCards: FlowerCard[];
  isLoading: boolean;
  isError: boolean;
  isEmpty: boolean;
  refetch: () => void;
}

export function useMindMap(): UseMindMapResult {
  const query = useQuery({
    queryKey: SOUL_FLOWER_QUERY_KEYS.mindMap,
    queryFn: getMindMapFullData,
  });

  const categories = useMemo(() => {
    const list = query.data?.categories ?? [];
    return [...list].sort((a, b) => a.sortOrder - b.sortOrder);
  }, [query.data?.categories]);

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  const activeCategoryId = selectedCategoryId ?? categories[0]?.id ?? null;

  const flowerCards = query.data?.flowerCards ?? [];
  const answeredQuestionIds = query.data?.answeredQuestionIds ?? [];

  const filteredFlowerCards = useMemo(() => {
    if (!activeCategoryId) {
      return [];
    }
    return flowerCards.filter((card) => card.categoryId === activeCategoryId);
  }, [flowerCards, activeCategoryId]);

  return {
    categories,
    flowerCards,
    answeredQuestionIds,
    selectedCategoryId: activeCategoryId,
    setSelectedCategoryId,
    filteredFlowerCards,
    isLoading: query.isLoading,
    isError: query.isError,
    isEmpty: !query.isLoading && categories.length === 0,
    refetch: () => {
      void query.refetch();
    },
  };
}
