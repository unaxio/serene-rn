export type QuestionType = "singleChoice" | "text";

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
  id?: string;
  userId?: string;
  questionId?: string;
  flowerId?: string | null;
  answerContent: string;
  createdAt: string;
  updatedAt?: string;
  dateKey?: string;
  summary?: string;
  explain?: string;
}

/** 今日答题结果（查看模式） */
export interface TodayAnswerResult {
  answerContent: string;
  summary: string;
  explain: string;
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
  success?: boolean;
  message?: string;
  summary?: string;
  explain?: string;
}

export type ThemeColor =
  | "red"
  | "orange"
  | "yellow"
  | "green"
  | "blue"
  | "purple"
  | "silver";

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
  imagePathPhase1?: string;
  imagePathPhase2?: string;
  imagePathPhase3?: string;
  imagePathPhase4?: string;
  imagePathPhase5?: string;
  imagePathPhase6?: string;
}

/** 续光卡使用记录 */
export interface LightCardUsage {
  id: string;
  dateKey: string;
  createdAt: string;
}

export interface MindMapFullDataResponse {
  categories: Category[];
  flowerCards: FlowerCard[];
  answeredQuestionIds: string[];
  /** 续光卡剩余数量 */
  lightCardCount?: number;
  /** 续光卡使用记录 */
  lightCardUsages?: LightCardUsage[];
}

export interface FlowerCardProgress {
  totalCount: number;
  completedCount: number;
  progressRatio: number;
}

export interface PartnerInfo {
  userId: string;
  nickName?: string;
  username?: string;
  avatarUrl?: string;
  avatarPath?: string;
  avatar?: string;
  todayAnswered: boolean;
  streakCount: number;
}

export interface PartnerStatusResponse {
  hasPartner: boolean;
  partnerInfo?: PartnerInfo;
  partnerStreakCount: number;
  myTodayAnswered: boolean;
  myStreakCount: number;
}

export type PartnerInviteStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "canceled";

export interface PartnerInviteItem {
  id: string;
  senderId: string;
  senderName?: string;
  receiverId: string;
  receiverName?: string;
  status: PartnerInviteStatus;
  createdAt: string;
}

export interface PartnerActionResponse {
  success: boolean;
  message?: string;
}

export interface UseLightCardResponse {
  success?: boolean;
  message?: string;
}

export type PartnerInviteAction = "accept" | "reject";

export interface CheckInSideRecords {
  answeredDateKeys: string[];
  lightCardUsages: LightCardUsage[];
}

export interface CheckInPartnerRecords extends CheckInSideRecords {
  userId: string;
}

/** 打卡记录 GET /soul-flower/app/checkin-records */
export interface CheckInRecordsResponse {
  me: CheckInSideRecords;
  hasPartner: boolean;
  partner: CheckInPartnerRecords | null;
}

export interface FlowerCardAnswerItem {
  id: string;
  questionTitle: string;
  answerContent: string;
  /** AI 解读摘要；有则优先于 answerContent 展示 */
  summary?: string;
  createdAt: string;
}
