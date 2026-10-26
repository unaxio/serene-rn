import { isAxiosError } from 'axios';

import { API_PATHS, HTTP_STATUS } from '@/src/services/config';
import { request } from '@/src/services/request';

import { unwrapResponse, type ApiEnvelope } from '@/src/features/square/api';
import type {
  GetSquareSearchParams,
  SearchHotBoard,
  SearchHotItem,
  SquareSearchPage,
} from '@/src/features/square/types';
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

interface HistoryRaw {
  items?: unknown;
}

interface HotItemRaw {
  rank?: number;
  id?: string;
  title?: string;
}

interface HotBoardRaw {
  stories?: HotItemRaw[];
  asks?: HotItemRaw[];
}

function normalizeHotItems(raw: HotItemRaw[] | undefined): SearchHotItem[] {
  if (!Array.isArray(raw)) {
    return [];
  }
  const items: SearchHotItem[] = [];
  for (const item of raw) {
    const id = typeof item?.id === 'string' ? item.id.trim() : '';
    if (id.length === 0) {
      continue;
    }
    const rank = typeof item.rank === 'number' && item.rank > 0 ? item.rank : items.length + 1;
    items.push({
      rank,
      id,
      title: typeof item.title === 'string' ? item.title : '',
    });
  }
  return items;
}

export async function getSearchHistory(): Promise<string[]> {
  const response = await request.get<HistoryRaw | ApiEnvelope<HistoryRaw>>(
    API_PATHS.SQUARE_SEARCH_HISTORY,
  );
  const data = unwrapResponse(response, '获取搜索历史失败');
  if (!Array.isArray(data.items)) {
    return [];
  }
  return data.items
    .filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
    .map((item) => item.trim());
}

export async function clearSearchHistory(): Promise<void> {
  const response = await request.delete<HistoryRaw | ApiEnvelope<HistoryRaw>>(
    API_PATHS.SQUARE_SEARCH_HISTORY,
  );
  unwrapResponse(response, '清空搜索历史失败');
}

export async function getSearchHot(): Promise<SearchHotBoard> {
  const response = await request.get<HotBoardRaw | ApiEnvelope<HotBoardRaw>>(
    API_PATHS.SQUARE_SEARCH_HOT,
  );
  const data = unwrapResponse(response, '获取热门内容失败');
  return {
    stories: normalizeHotItems(data.stories),
    asks: normalizeHotItems(data.asks),
  };
}

export async function probeSearchHotTarget(kind: 'story' | 'ask', id: string): Promise<void> {
  const path =
    kind === 'story' ? `${API_PATHS.SQUARE_STORIES}/${id}` : `${API_PATHS.SQUARE_ASKS}/${id}`;
  const response = await request.get(path, { skipErrorToast: true });
  unwrapResponse(response, '该内容暂不可查看');
}

export function isUnavailableContent(error: unknown): boolean {
  return isAxiosError(error) && error.response?.status === HTTP_STATUS.NOT_FOUND;
}
