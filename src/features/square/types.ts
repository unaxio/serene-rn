export type SquareTargetType = 'story' | 'share' | 'ask' | 'ask_answer' | 'comment';

export type SquareActionType = 'resonate' | 'collect' | 'flower';

export type SquareSubTabId = 'story' | 'share' | 'ask';

export interface SquareAuthor {
  id: string | null;
  nickName: string;
  avatarUrl: string;
  level?: string | number | null;
}

export interface SquarePagedData<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface Story {
  id: string;
  title: string;
  content: string;
  summary: string;
  topicTag: string | null;
  tags: string[];
  coverImagePath: string | null;
  author: SquareAuthor;
  resonateCount: number;
  collectCount: number;
  flowerCount: number;
  commentCount: number;
  isResonated: boolean;
  isCollected: boolean;
  isFlowered: boolean;
  createdAt: string;
}

export interface SquareComment {
  id: string;
  content: string;
  author: SquareAuthor;
  parentId: string | null;
  rootId: string;
  replyCount: number;
  resonateCount: number;
  collectCount: number;
  flowerCount: number;
  isResonated: boolean;
  isCollected: boolean;
  isFlowered: boolean;
  topReplies: SquareComment[];
  parentAuthor: SquareAuthor | null;
  createdAt: string;
}

export interface ToggleActionResponse {
  resonateCount?: number;
  isResonated?: boolean;
  collectCount?: number;
  isCollected?: boolean;
  flowerCount?: number;
  isFlowered?: boolean;
  remainingPurchasedCount?: number;
}

export interface CreateCommentResponse {
  id: string;
  commentCount?: number;
}

export interface UploadSquareImageResponse {
  relativePath: string;
}

export interface CreateStoryPayload {
  title: string;
  content: string;
  topicTag: string;
  coverImage?: string;
  isAnonymous: boolean;
  isDraft: boolean;
}

export interface GetStoriesParams {
  category: string;
  page: number;
  pageSize: number;
}

export interface GetCommentsParams {
  targetType: SquareTargetType;
  targetId: string;
  page: number;
  pageSize: number;
}

export interface CreateCommentPayload {
  targetType: SquareTargetType;
  targetId: string;
  content: string;
}

export interface CreateReplyPayload {
  targetType: SquareTargetType;
  targetId: string;
  rootId: string;
  parentId: string;
  content: string;
}

export interface SquareActionPayload {
  targetType: SquareTargetType;
  targetId: string;
  actionType: SquareActionType;
  quantity?: number;
  giftFlowerId?: string;
}

export interface GiftFlower {
  id: string;
  name: string;
  tag: string;
  imagePath: string;
  coinValue: number;
  status: number;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface GiftFlowerInventoryItem {
  giftFlowerId: string;
  name: string;
  tag: string;
  imagePath: string;
  coinValue: number;
  purchasedCount: number;
  receivedCount: number;
}

export interface GiftFlowerInventory {
  flowerCoin: number;
  items: GiftFlowerInventoryItem[];
}

export interface PurchaseGiftFlowerPayload {
  giftFlowerId: string;
  quantity?: number;
}

export interface PurchaseGiftFlowerResponse {
  giftFlowerId: string;
  purchasedCount: number;
  receivedCount: number;
  flowerCoin: number;
}

export type ShareVisibleRange = 'public' | 'friends' | 'private';

export interface Share {
  id: string;
  content: string;
  images: string[];
  topicTag: string | null;
  visibleRange: ShareVisibleRange;
  author: SquareAuthor;
  resonateCount: number;
  collectCount: number;
  flowerCount: number;
  commentCount: number;
  isResonated: boolean;
  isCollected: boolean;
  isFlowered: boolean;
  createdAt: string;
}

export interface CreateSharePayload {
  content: string;
  images: string[];
  visibleRange: ShareVisibleRange;
  topicTag?: string;
}

export interface GetSharesParams {
  page: number;
  pageSize: number;
}

export type AskAnswerSort = 'latest' | 'hot';

export interface Ask {
  id: string;
  title: string;
  content: string;
  topicTag: string | null;
  author: SquareAuthor;
  answerCount: number;
  viewCount: number;
  commentCount: number;
  resonateCount: number;
  collectCount: number;
  isResonated: boolean;
  isCollected: boolean;
  answerSummary: string | null;
  answererAvatar: string | null;
  createdAt: string;
}

export interface AskAnswer {
  id: string;
  askId: string;
  content: string;
  author: SquareAuthor;
  resonateCount: number;
  collectCount: number;
  flowerCount: number;
  commentCount: number;
  isResonated: boolean;
  isCollected: boolean;
  isFlowered: boolean;
  createdAt: string;
}

export interface CreateAskPayload {
  title: string;
  content: string;
  topicTag: string;
  isAnonymous: boolean;
}

export interface CreateAskAnswerPayload {
  content: string;
  isAnonymous: boolean;
}

export interface GetAsksParams {
  page: number;
  pageSize: number;
}

export interface GetAskAnswersParams {
  askId: string;
  sort: AskAnswerSort;
  page: number;
  pageSize: number;
}
