import type { FlowerCard, TodayTaskResponse } from '../types';

/**
 * 用 flowerId 在 full-data 的 flowerCards 中匹配当前花卡
 */
export function findFlowerCardById(
  flowerCards: FlowerCard[],
  flowerId?: string | null,
): FlowerCard | null {
  if (!flowerId) {
    return null;
  }
  return flowerCards.find((card) => card.id === flowerId) ?? null;
}

/**
 * 未答题用 question.flowerId，答完后用 todayAnswer.flowerId。
 */
export function getTodayFlowerId(
  todayTask?: TodayTaskResponse | null,
): string | null {
  if (!todayTask) {
    return null;
  }
  if (todayTask.alreadyAnswered) {
    return todayTask.todayAnswer?.flowerId ?? todayTask.question?.flowerId ?? null;
  }
  return todayTask.question?.flowerId ?? null;
}
