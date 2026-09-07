import { API_PATHS } from '@/src/services/config';
import { request } from '@/src/services/request';

import { unwrapResponse, type ApiEnvelope } from '@/src/features/square/api';
import { SEARCH_PAGE_SIZE } from '@/src/features/square/constants';
import type { GetSquareSearchParams, SquareSearchPage } from '@/src/features/square/types';
import {
  normalizeSearchPage,
  type SearchItemRaw,
} from '@/src/features/square/utils/normalize';

interface SearchPageRaw {
  items?: SearchItemRaw[];
  size?: number;
}

export async function getSquareSearch(
  params: GetSquareSearchParams,
): Promise<SquareSearchPage> {
  const queryParams: Record<string, string | number> = {
    keyword: params.keyword,
    size: params.size,
  };
  if (params.start) {
    queryParams.start = params.start;
  }
  if (params.end) {
    queryParams.end = params.end;
  }
  const response = await request.get<SearchPageRaw | ApiEnvelope<SearchPageRaw>>(
    API_PATHS.SQUARE_SEARCH,
    { params: queryParams },
  );
  return normalizeSearchPage(
    unwrapResponse(response, '搜索失败'),
    params.size ?? SEARCH_PAGE_SIZE,
  );
}
