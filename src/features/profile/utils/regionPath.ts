import { REGION_INVALID_MESSAGE } from '@/src/features/profile/constants';
import type {
  ProfileCity,
  RegionDetail,
  RegionOption,
  RegionPathItem,
} from '@/src/features/profile/regionTypes';

export const REGION_PATH_SEPARATOR = ' ';

interface RegionPathRaw {
  code?: string;
  name?: string;
}

export interface RegionOptionRaw {
  code?: string;
  name?: string;
  leaf?: boolean;
}

export interface RegionDetailRaw {
  code?: string;
  name?: string;
  leaf?: boolean;
  path?: RegionPathRaw[] | string | null;
  fullPath?: string | null;
  fullName?: string | null;
}

export interface ProfileCityRaw {
  name?: string | null;
  path?: RegionPathRaw[] | string | null;
  fullPath?: string | null;
  fullName?: string | null;
}

export function formatRegionPath(names: string[]): string {
  return names
    .map((name) => name.trim())
    .filter((name) => name.length > 0)
    .join(REGION_PATH_SEPARATOR);
}

export function formatProfileCityLabel(
  city: ProfileCity | null | undefined,
  region: string | null | undefined,
): string {
  const fullPath = city?.fullPath.trim() ?? '';
  const name = city?.name.trim() ?? '';
  const regionText = region?.trim() ?? '';
  if (fullPath.length > 0 && fullPath !== name) {
    return fullPath;
  }
  if (regionText.length > 0) {
    return regionText;
  }
  return fullPath || name;
}

export function normalizeRegionOption(raw: RegionOptionRaw): RegionOption | null {
  const code = raw.code?.trim() ?? '';
  const name = raw.name?.trim() ?? '';
  if (!code || !name) {
    return null;
  }
  return { code, name, leaf: raw.leaf === true };
}

function readExplicitFullPath(raw: {
  path?: RegionPathRaw[] | string | null;
  fullPath?: string | null;
  fullName?: string | null;
}): string {
  if (typeof raw.fullPath === 'string' && raw.fullPath.trim()) {
    return raw.fullPath.trim();
  }
  if (typeof raw.fullName === 'string' && raw.fullName.trim()) {
    return raw.fullName.trim();
  }
  if (typeof raw.path === 'string' && raw.path.trim()) {
    return raw.path.trim();
  }
  return '';
}

function readPathNodes(path: RegionPathRaw[] | string | null | undefined): RegionPathItem[] {
  if (!Array.isArray(path)) {
    return [];
  }
  return path.flatMap((node) => {
    const code = node.code?.trim() ?? '';
    const name = node.name?.trim() ?? '';
    if (!code || !name) {
      return [];
    }
    return [{ code, name }];
  });
}

export function normalizeRegionDetail(raw: RegionDetailRaw): RegionDetail {
  const code = raw.code?.trim() ?? '';
  const name = raw.name?.trim() ?? '';
  if (!code) {
    throw new Error(REGION_INVALID_MESSAGE);
  }
  const nodes = readPathNodes(raw.path);
  const last = nodes[nodes.length - 1];
  const withCurrent = !name || last?.code === code ? nodes : [...nodes, { code, name }];
  const path = withCurrent.length > 0 ? withCurrent : name ? [{ code, name }] : [];
  const fullPath =
    readExplicitFullPath(raw) || formatRegionPath(path.map((node) => node.name)) || name;
  return {
    code,
    name: name || path[path.length - 1]?.name || code,
    leaf: raw.leaf === true,
    path,
    fullPath,
  };
}

export function normalizeProfileCity(raw: ProfileCityRaw | null | undefined): ProfileCity | null {
  if (!raw) {
    return null;
  }
  const name = raw.name?.trim() ?? '';
  const fromNodes = formatRegionPath(readPathNodes(raw.path).map((node) => node.name));
  const fullPath = readExplicitFullPath(raw) || fromNodes || name;
  if (!name && !fullPath) {
    return null;
  }
  return { name: name || fullPath, fullPath };
}
