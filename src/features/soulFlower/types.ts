export type QuestionType = 'singleChoice' | 'text';

export interface Question {
  id: string;
  flowerId: string | null;
  type: QuestionType;
  title: string;
  options?: string[];
  sortOrder: number;
  flowerName?: string;
  categoryName?: string;
}

export interface TodayAnswer {
  answerContent: string;
  createdAt: string;
}

export interface TodayTaskResponse {
  hasTask: boolean;
  alreadyAnswered: boolean;
  question?: Question;
  todayAnswer?: TodayAnswer;
}

export interface SubmitAnswerRequest {
  questionId: string;
  answerContent: string;
}

export interface SubmitAnswerResponse {
  success: boolean;
  message?: string;
}

export type ThemeColor =
  | 'red'
  | 'orange'
  | 'yellow'
  | 'green'
  | 'blue'
  | 'purple'
  | 'silver';

export interface Category {
  id: string;
  name: string;
  sortOrder: number;
}

export interface FlowerCard {
  id: string;
  categoryId: string;
  title: string;
  flowerName: string;
  language: string;
  themeColor: ThemeColor;
  questionIds: string[];
}

export interface MindMapFullDataResponse {
  categories: Category[];
  flowerCards: FlowerCard[];
  answeredQuestionIds: string[];
}

export interface FlowerCardProgress {
  totalCount: number;
  completedCount: number;
  progressRatio: number;
}
