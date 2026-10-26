import { API_PATHS } from '@/src/services/config';
import { request } from '@/src/services/request';

import { unwrapResponse, type ApiEnvelope } from '@/src/features/square/api';
import type { GetSquareSearchParams, SquareSearchPage } from '@/src/features/square/types';
import {
  normalizeSearchPage,
  type SearchPageRaw,
} from '@/src/features/square/utils/normalize';

export async function getSquareSearch(
  params: GetSquareSearchParams,
): Promise<SquareSearchPage> {
  const response = await request.get<SearchPageRaw | ApiEnvelope<SearchPageRaw>>(
    API_PATHS.SQUARE_SEARCH,
    {
      params: {
        keyword: params.keyword,
        page: params.page,
        pageSize: params.pageSize,
      },
    },
  );
  return normalizeSearchPage(unwrapResponse(response, '搜索失败'), params.pageSize);
}
