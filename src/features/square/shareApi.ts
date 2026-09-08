import { API_PATHS } from '@/src/services/config';
import { request } from '@/src/services/request';

import { unwrapResponse, unwrapVoidResponse, type ApiEnvelope } from '@/src/features/square/api';
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

export async function getShareDetail(id: string): Promise<Share> {
  const response = await request.get<ShareRaw | ApiEnvelope<ShareRaw>>(
    `${API_PATHS.SQUARE_SHARES}/${id}`,
  );
  return normalizeShare(unwrapResponse(response, '获取分享失败'));
}

export async function updateShare(
  id: string,
  payload: CreateSharePayload,
): Promise<Share> {
  const response = await request.put<ShareRaw | ApiEnvelope<ShareRaw>>(
    `${API_PATHS.SQUARE_SHARES}/${id}`,
    payload,
  );
  return normalizeShare(unwrapResponse(response, '修改分享失败'));
}

export async function deleteShare(id: string): Promise<void> {
  const response = await request.delete<unknown | ApiEnvelope<unknown>>(
    `${API_PATHS.SQUARE_SHARES}/${id}`,
  );
  unwrapVoidResponse(response, '删除分享失败');
}
