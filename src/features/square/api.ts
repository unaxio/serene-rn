import { API_PATHS, API_SUCCESS_CODE } from '@/src/services/config';
import { request } from '@/src/services/request';

import { ALL_TOPIC_CATEGORY } from './constants';
import type {
  CreateCommentPayload,
  CreateCommentResponse,
  CreateReplyPayload,
  GetCommentsParams,
  GetStoriesParams,
  SquareActionPayload,
  SquareComment,
  SquarePagedData,
  Story,
  ToggleActionResponse,
  UploadSquareImageResponse,
} from './types';
import {
  normalizeComment,
  normalizeStory,
  toEntityId,
  unwrapPagedItems,
  type CommentRaw,
  type StoryRaw,
} from './utils/normalize';

interface ApiEnvelope<T> {
  statusCode: number;
  message: string;
  data?: T;
}

function isApiEnvelope<T>(value: unknown): value is ApiEnvelope<T> {
  return (
    typeof value === 'object' &&
    value !== null &&
    'statusCode' in value &&
    typeof (value as ApiEnvelope<T>).statusCode === 'number'
  );
}

function unwrapResponse<T>(payload: T | ApiEnvelope<T>, fallbackMessage: string): T {
  if (isApiEnvelope<T>(payload)) {
    if (payload.statusCode !== API_SUCCESS_CODE || payload.data === undefined) {
      throw new Error(payload.message || fallbackMessage);
    }
    return payload.data;
  }
  return payload;
}

function toCommentCreateResult(
  data: CreateCommentResponse | CommentRaw,
): CreateCommentResponse {
  return {
    id: toEntityId(data),
    commentCount: 'commentCount' in data ? data.commentCount : undefined,
  };
}

export async function getStories(
  params: GetStoriesParams,
): Promise<SquarePagedData<Story>> {
  const category =
    params.category === ALL_TOPIC_CATEGORY ? undefined : params.category;
  const response = await request.get<
    SquarePagedData<StoryRaw> | ApiEnvelope<SquarePagedData<StoryRaw>>
  >(API_PATHS.SQUARE_STORIES, {
    params: {
      category,
      page: params.page,
      pageSize: params.pageSize,
    },
  });
  return unwrapPagedItems(unwrapResponse(response, '获取故事列表失败'), normalizeStory);
}

export async function getStoryDetail(id: string): Promise<Story> {
  const response = await request.get<StoryRaw | ApiEnvelope<StoryRaw>>(
    `${API_PATHS.SQUARE_STORIES}/${id}`,
  );
  return normalizeStory(unwrapResponse(response, '获取故事详情失败'));
}

export async function getComments(
  params: GetCommentsParams,
): Promise<SquarePagedData<SquareComment>> {
  const response = await request.get<
    SquarePagedData<CommentRaw> | ApiEnvelope<SquarePagedData<CommentRaw>>
  >(API_PATHS.SQUARE_COMMENTS, {
    params: {
      targetType: params.targetType,
      targetId: params.targetId,
      page: params.page,
      pageSize: params.pageSize,
    },
  });
  return unwrapPagedItems(unwrapResponse(response, '获取评论失败'), normalizeComment);
}

export async function createComment(
  payload: CreateCommentPayload,
): Promise<CreateCommentResponse> {
  const response = await request.post<
    CreateCommentResponse | CommentRaw | ApiEnvelope<CreateCommentResponse | CommentRaw>
  >(API_PATHS.SQUARE_COMMENTS, payload);
  return toCommentCreateResult(unwrapResponse(response, '发表评论失败'));
}

export async function createReply(
  payload: CreateReplyPayload,
): Promise<CreateCommentResponse> {
  const response = await request.post<
    CreateCommentResponse | CommentRaw | ApiEnvelope<CreateCommentResponse | CommentRaw>
  >(`${API_PATHS.SQUARE_COMMENTS}/reply`, payload);
  return toCommentCreateResult(unwrapResponse(response, '发表回复失败'));
}

export async function getCommentReplies(rootId: string): Promise<SquareComment[]> {
  const response = await request.get<
    CommentRaw[] | SquarePagedData<CommentRaw> | ApiEnvelope<CommentRaw[] | SquarePagedData<CommentRaw>>
  >(`${API_PATHS.SQUARE_COMMENTS}/${rootId}/replies`);
  const data = unwrapResponse(response, '获取回复失败');
  if (Array.isArray(data)) {
    return data.map(normalizeComment);
  }
  return (data.items ?? []).map(normalizeComment);
}

export async function toggleSquareAction(
  payload: SquareActionPayload,
): Promise<ToggleActionResponse> {
  const response = await request.post<
    ToggleActionResponse | ApiEnvelope<ToggleActionResponse>
  >(API_PATHS.SQUARE_ACTIONS, payload);
  return unwrapResponse(response, '操作失败');
}

export async function uploadSquareImage(
  file: { uri: string; name: string; type: string },
): Promise<UploadSquareImageResponse> {
  const formData = new FormData();
  formData.append('file', {
    uri: file.uri,
    name: file.name,
    type: file.type,
  } as unknown as Blob);
  const response = await request.post<
    UploadSquareImageResponse | ApiEnvelope<UploadSquareImageResponse>
  >(API_PATHS.SQUARE_IMAGE_UPLOAD, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return unwrapResponse(response, '上传图片失败');
}
