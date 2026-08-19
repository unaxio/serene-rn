import { PETAL_SLOT_COUNT } from '../constants';
import type { FlowerCard, FlowerCardProgress } from '../types';

/**
 * 根据花卡绑定题目与已答 ID 计算本地进度
 */
export function calcFlowerCardProgress(
  card: FlowerCard,
  answeredQuestionIds: string[],
): FlowerCardProgress {
  const answeredSet = new Set(answeredQuestionIds);
  const totalCount = card.questionIds.length;
  const completedCount = card.questionIds.filter((id) => answeredSet.has(id)).length;
  const progressRatio = totalCount === 0 ? 0 : completedCount / totalCount;

  return {
    totalCount,
    completedCount,
    progressRatio,
  };
}

export function formatProgressLabel(completedCount: number, totalCount: number): string {
  return `${completedCount}/${totalCount}`;
}

export interface CategoryCompletionStat {
  /** 已达到进度 6 的花卡数 */
  completedCount: number;
  /** 分类下花卡总数 */
  totalCount: number;
}

/**
 * 统计各分类：已满进度 6 的花卡数 / 花卡总数
 */
export function calcCategoryCompletionStats(
  flowerCards: FlowerCard[],
  answeredQuestionIds: string[],
): Record<string, CategoryCompletionStat> {
  const answeredSet = new Set(answeredQuestionIds);
  const stats: Record<string, CategoryCompletionStat> = {};

  flowerCards.forEach((card) => {
    const current = stats[card.categoryId] ?? { completedCount: 0, totalCount: 0 };
    current.totalCount += 1;

    const answeredCount = card.questionIds.filter((id) => answeredSet.has(id)).length;
    if (answeredCount >= PETAL_SLOT_COUNT) {
      current.completedCount += 1;
    }

    stats[card.categoryId] = current;
  });

  return stats;
}

/**
 * 按完成进度选取花图：1–6 对应 phase1–phase6；
 * 进度为 0（锁定）时使用 phase6，由展示层叠加模糊与锁标。
 */
export function getFlowerPhaseImagePath(
  card: FlowerCard | null | undefined,
  completedCount: number,
): string | undefined {
  if (!card) {
    return undefined;
  }

  if (completedCount <= 0) {
    return card.imagePathPhase6;
  }

  const phase = Math.min(completedCount, PETAL_SLOT_COUNT);

  switch (phase) {
    case 1:
      return card.imagePathPhase1;
    case 2:
      return card.imagePathPhase2;
    case 3:
      return card.imagePathPhase3;
    case 4:
      return card.imagePathPhase4;
    case 5:
      return card.imagePathPhase5;
    default:
      return card.imagePathPhase6;
  }
}
