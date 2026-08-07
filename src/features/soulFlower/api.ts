import { API_PATHS, API_SUCCESS_CODE } from '@/src/services/config';
import { request } from '@/src/services/request';

import type {
  MindMapFullDataResponse,
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
