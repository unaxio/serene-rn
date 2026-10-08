const TEST_CDN_BASE_URL = "https://cdn.serene.org.cn/dev";

/** 相对路径图片的 CDN 前缀；生产构建由 EXPO_PUBLIC_CDN_BASE_URL 注入 */
export const CDN_BASE_URL =
  process.env.EXPO_PUBLIC_CDN_BASE_URL ?? TEST_CDN_BASE_URL;

const ABSOLUTE_URL_PATTERN = /^https?:\/\//i;

/**
 * 将相对资源路径补全为完整 CDN URL；已是绝对地址则原样返回。
 */
export function resolveCdnUrl(path?: string | null): string | null {
  if (!path) {
    return null;
  }

  const trimmed = path.trim();
  if (!trimmed) {
    return null;
  }

  if (ABSOLUTE_URL_PATTERN.test(trimmed)) {
    return trimmed;
  }

  const normalizedPath = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return `${CDN_BASE_URL}${normalizedPath}`;
}
