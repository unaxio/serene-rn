import { API_PATHS } from '@/src/services/config';
import { request } from '@/src/services/request';

import { unwrapResponse, type ApiEnvelope } from '@/src/features/square/api';
import { TOPIC_HASH } from '@/src/features/square/constants';
import type { SquareSearchPage } from '@/src/features/square/types';
import { normalizeSearchPage, type SearchPageRaw } from '@/src/features/square/utils/normalize';

export function bareTopicName(value: string): string {
  const trimmed = value.trim();
  if (trimmed.length >= 2 && trimmed.startsWith(TOPIC_HASH) && trimmed.endsWith(TOPIC_HASH)) {
    return trimmed.slice(1, -1).trim();
  }
  return trimmed;
}

interface TopicSearchRaw {
  items?: object[];
}

function readTopicName(entry: object): string {
  if (!('name' in entry)) {
    return '';
  }
  const name = entry.name;
  return typeof name === 'string' ? bareTopicName(name) : '';
}

function normalizeTopicNames(raw: object[] | undefined): string[] {
  if (!Array.isArray(raw)) {
    return [];
  }
  const names: string[] = [];
  for (const entry of raw) {
    if (!entry || typeof entry !== 'object') {
      continue;
    }
    const name = readTopicName(entry);
    if (name.length === 0 || names.includes(name)) {
      continue;
    }
    names.push(name);
  }
  return names;
}

export async function getSearchTopics(keyword: string): Promise<string[]> {
  const response = await request.get<TopicSearchRaw | ApiEnvelope<TopicSearchRaw>>(
    API_PATHS.SQUARE_SEARCH_TOPICS,
    { params: { keyword }, skipErrorToast: true },
  );
  const data = unwrapResponse(response, '搜索话题失败');
  return normalizeTopicNames(data.items);
}

export async function getTopicPosts(params: {
  name: string;
  page: number;
  pageSize: number;
}): Promise<SquareSearchPage> {
  const response = await request.get<SearchPageRaw | ApiEnvelope<SearchPageRaw>>(
    API_PATHS.SQUARE_TOPIC_POSTS,
    {
      params: {
        name: params.name,
        page: params.page,
        pageSize: params.pageSize,
      },
    },
  );
  return normalizeSearchPage(unwrapResponse(response, '获取话题内容失败'), params.pageSize);
}
