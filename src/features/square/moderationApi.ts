import { API_PATHS } from '@/src/services/config';
import { request } from '@/src/services/request';

import { unwrapVoidResponse, type ApiEnvelope } from '@/src/features/square/api';
import type {
  CreateNotInterestedPayload,
  CreateReportPayload,
} from '@/src/features/square/types';

export async function createReport(payload: CreateReportPayload): Promise<void> {
  const response = await request.post<unknown | ApiEnvelope<unknown>>(
    API_PATHS.SQUARE_REPORTS,
    payload,
  );
  unwrapVoidResponse(response, '举报失败');
}

export async function createNotInterested(
  payload: CreateNotInterestedPayload,
): Promise<void> {
  const response = await request.post<unknown | ApiEnvelope<unknown>>(
    API_PATHS.SQUARE_NOT_INTERESTED,
    payload,
  );
  unwrapVoidResponse(response, '标记失败');
}
