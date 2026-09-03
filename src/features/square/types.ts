export type SquareTargetType = 'story' | 'share' | 'ask' | 'ask_answer' | 'comment';

export type SquareActionType = 'resonate' | 'collect' | 'flower';

export type SquareSubTabId = 'story' | 'share' | 'ask';

export interface SquareAuthor {
  id: string | null;
  nickName: string;
  avatarUrl: string;
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

export interface CommentReplyPreview {
  id: string;
  content: string;
  author: SquareAuthor;
  parentId: string | null;
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
  isResonated: boolean;
  isCollected: boolean;
  topReplies: CommentReplyPreview[];
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
}

export interface CreateCommentResponse {
  id: string;
  commentCount?: number;
}

export interface UploadSquareImageResponse {
  imagePath: string;
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
  message?: string;
}
