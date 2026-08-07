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
