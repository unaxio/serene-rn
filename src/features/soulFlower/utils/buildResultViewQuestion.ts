import type { FlowerCard, Question, TodayAnswer } from '@/src/features/soulFlower/types';

const DEFAULT_RESULT_QUESTION_TITLE = '今日觉察';

/**
 * 已答完时 today-task 可能只返回 todayAnswer，需据此构造 QuestionForm 所需题目。
 */
export function buildResultViewQuestion(
  todayAnswer: TodayAnswer,
  flowerCard?: FlowerCard | null,
  categoryName?: string,
): Question | undefined {
  if (!todayAnswer.questionId) {
    return undefined;
  }

  return {
    id: todayAnswer.questionId,
    flowerId: todayAnswer.flowerId ?? null,
    type: 'text',
    title: DEFAULT_RESULT_QUESTION_TITLE,
    sortOrder: 0,
    flowerName: flowerCard?.flowerName,
    categoryName,
  };
}
