import { API_PATHS } from '@/src/services/config';
import { request } from '@/src/services/request';

import { unwrapResponse, type ApiEnvelope } from '@/src/features/square/api';
import type {
  Ask,
  AskAnswer,
  CreateAskAnswerPayload,
  CreateAskPayload,
  GetAskAnswersParams,
  GetAsksParams,
  SquarePagedData,
} from '@/src/features/square/types';
import {
  normalizeAsk,
  normalizeAskAnswer,
  unwrapPagedItems,
  type AskAnswerRaw,
  type AskRaw,
} from '@/src/features/square/utils/normalize';

export async function getAsks(params: GetAsksParams): Promise<SquarePagedData<Ask>> {
  const response = await request.get<
    SquarePagedData<AskRaw> | ApiEnvelope<SquarePagedData<AskRaw>>
  >(API_PATHS.SQUARE_ASKS, {
    params: {
      page: params.page,
      pageSize: params.pageSize,
    },
  });
  return unwrapPagedItems(unwrapResponse(response, '获取问答失败'), normalizeAsk);
}

export async function getAskDetail(id: string): Promise<Ask> {
  const response = await request.get<AskRaw | ApiEnvelope<AskRaw>>(
    `${API_PATHS.SQUARE_ASKS}/${id}`,
  );
  return normalizeAsk(unwrapResponse(response, '获取问答详情失败'));
}

export async function createAsk(payload: CreateAskPayload): Promise<Ask> {
  const response = await request.post<AskRaw | ApiEnvelope<AskRaw>>(
    API_PATHS.SQUARE_ASKS,
    payload,
  );
  return normalizeAsk(unwrapResponse(response, '发布提问失败'));
}

export async function getAskAnswers(
  params: GetAskAnswersParams,
): Promise<SquarePagedData<AskAnswer>> {
  const response = await request.get<
    SquarePagedData<AskAnswerRaw> | ApiEnvelope<SquarePagedData<AskAnswerRaw>>
  >(`${API_PATHS.SQUARE_ASKS}/${params.askId}/answers`, {
    params: {
      sort: params.sort,
      page: params.page,
      pageSize: params.pageSize,
    },
  });
  return unwrapPagedItems(
    unwrapResponse(response, '获取回答失败'),
    (item) => normalizeAskAnswer({ ...item, askId: item.askId ?? params.askId }),
  );
}

export async function createAskAnswer(
  askId: string,
  payload: CreateAskAnswerPayload,
): Promise<AskAnswer> {
  const response = await request.post<AskAnswerRaw | ApiEnvelope<AskAnswerRaw>>(
    `${API_PATHS.SQUARE_ASKS}/${askId}/answers`,
    payload,
  );
  return normalizeAskAnswer({
    ...unwrapResponse(response, '提交回答失败'),
    askId,
  });
}
