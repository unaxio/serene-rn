import { API_PATHS } from '@/src/services/config';
import { request } from '@/src/services/request';
import { unwrapResponse, type ApiEnvelope } from '@/src/features/square/api';
import type { RegionDetail, RegionOption } from '@/src/features/profile/regionTypes';
import {
  normalizeRegionDetail,
  normalizeRegionOption,
  type RegionDetailRaw,
  type RegionOptionRaw,
} from '@/src/features/profile/utils/regionPath';

function readRegionItems(
  data: RegionOptionRaw[] | { items?: RegionOptionRaw[] } | null | undefined,
): RegionOptionRaw[] {
  if (Array.isArray(data)) {
    return data;
  }
  return data?.items ?? [];
}

export async function getRegions(parentCode?: string): Promise<RegionOption[]> {
  const response = await request.get<
    | RegionOptionRaw[]
    | { items?: RegionOptionRaw[] }
    | ApiEnvelope<RegionOptionRaw[] | { items?: RegionOptionRaw[] }>
  >(API_PATHS.REGIONS, {
    params: parentCode ? { parentCode } : undefined,
  });
  return readRegionItems(unwrapResponse(response, '获取地区失败')).flatMap((raw) => {
    const option = normalizeRegionOption(raw);
    return option ? [option] : [];
  });
}

export async function getRegionDetail(code: string): Promise<RegionDetail> {
  const response = await request.get<RegionDetailRaw | ApiEnvelope<RegionDetailRaw>>(
    `${API_PATHS.REGIONS}/${encodeURIComponent(code)}`,
  );
  return normalizeRegionDetail(unwrapResponse(response, '获取地区详情失败'));
}
