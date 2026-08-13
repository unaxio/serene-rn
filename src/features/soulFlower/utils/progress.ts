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
