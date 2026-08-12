import { API_PATHS, API_SUCCESS_CODE } from '@/src/services/config';
import { request } from '@/src/services/request';

import type {
  MindMapFullDataResponse,
  PartnerActionResponse,
  PartnerInviteAction,
  PartnerInviteItem,
  PartnerStatusResponse,
  SubmitAnswerRequest,
  SubmitAnswerResponse,
  TodayTaskResponse,
} from './types';

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

/**
 * 获取今日觉察任务 GET /soul-flower/app/today-task
 */
export async function getTodayTask(): Promise<TodayTaskResponse> {
  const response = await request.get<TodayTaskResponse | ApiEnvelope<TodayTaskResponse>>(
    API_PATHS.SOUL_FLOWER_TODAY_TASK,
  );
  return unwrapResponse(response, '获取今日任务失败');
}

/**
 * 提交答案 POST /soul-flower/app/submit-answer
 */
export async function submitAnswer(
  data: SubmitAnswerRequest,
): Promise<SubmitAnswerResponse> {
  const response = await request.post<
    SubmitAnswerResponse | ApiEnvelope<SubmitAnswerResponse>
  >(API_PATHS.SOUL_FLOWER_SUBMIT_ANSWER, data);
  return unwrapResponse(response, '提交答案失败');
}

/**
 * 获取全量图谱与进度 GET /soul-flower/app/mind-map/full-data
 */
export async function getMindMapFullData(): Promise<MindMapFullDataResponse> {
  const response = await request.get<
    MindMapFullDataResponse | ApiEnvelope<MindMapFullDataResponse>
  >(API_PATHS.SOUL_FLOWER_MIND_MAP);
  return unwrapResponse(response, '获取认知图谱失败');
}

/**
 * 查看伙伴及双人打卡状态 GET /soul-flower/app/partner/status
 */
export async function getPartnerStatus(): Promise<PartnerStatusResponse> {
  const response = await request.get<
    PartnerStatusResponse | ApiEnvelope<PartnerStatusResponse>
  >(API_PATHS.SOUL_FLOWER_PARTNER_STATUS);
  return unwrapResponse(response, '获取伙伴状态失败');
}

/**
 * 发送伙伴邀请 POST /soul-flower/app/partner/invite
 */
export async function sendPartnerInvite(
  receiverUserId: string,
): Promise<PartnerActionResponse> {
  const response = await request.post<
    PartnerActionResponse | ApiEnvelope<PartnerActionResponse>
  >(API_PATHS.SOUL_FLOWER_PARTNER_INVITE, { receiverUserId });
  return unwrapResponse(response, '发送邀请失败');
}

/**
 * 获取我的邀请列表 GET /soul-flower/app/partner/invites
 */
export async function getPartnerInvites(): Promise<PartnerInviteItem[]> {
  const response = await request.get<
    PartnerInviteItem[] | ApiEnvelope<PartnerInviteItem[]>
  >(API_PATHS.SOUL_FLOWER_PARTNER_INVITES);
  return unwrapResponse(response, '获取邀请列表失败');
}

/**
 * 处理邀请 POST /soul-flower/app/partner/invite/handle
 */
export async function handlePartnerInvite(
  inviteId: string,
  action: PartnerInviteAction,
): Promise<PartnerActionResponse> {
  const response = await request.post<
    PartnerActionResponse | ApiEnvelope<PartnerActionResponse>
  >(API_PATHS.SOUL_FLOWER_PARTNER_INVITE_HANDLE, { inviteId, action });
  return unwrapResponse(response, '处理邀请失败');
}
