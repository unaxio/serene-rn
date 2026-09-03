import { API_PATHS } from '@/src/services/config';
import { request } from '@/src/services/request';

import { unwrapResponse, type ApiEnvelope } from '@/src/features/square/api';
import type {
  CreateSharePayload,
  GetSharesParams,
  Share,
  SquarePagedData,
} from '@/src/features/square/types';
import {
  normalizeShare,
  unwrapPagedItems,
  type ShareRaw,
} from '@/src/features/square/utils/normalize';

export async function getShares(
  params: GetSharesParams,
): Promise<SquarePagedData<Share>> {
  const response = await request.get<
    SquarePagedData<ShareRaw> | ApiEnvelope<SquarePagedData<ShareRaw>>
  >(API_PATHS.SQUARE_SHARES, {
    params: {
      page: params.page,
      pageSize: params.pageSize,
    },
  });
  return unwrapPagedItems(unwrapResponse(response, '获取分享失败'), normalizeShare);
}

export async function createShare(payload: CreateSharePayload): Promise<Share> {
  const response = await request.post<ShareRaw | ApiEnvelope<ShareRaw>>(
    API_PATHS.SQUARE_SHARES,
    payload,
  );
  return normalizeShare(unwrapResponse(response, '发布分享失败'));
}
