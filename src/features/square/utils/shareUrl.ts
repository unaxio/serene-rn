import { Platform } from 'react-native';

import { TEST_WEB_BASE_PATH, WEB_PUBLIC_ORIGIN } from '@/src/services/config';

function getWebLocation(): { origin: string; pathname: string } | null {
  if (Platform.OS !== 'web') {
    return null;
  }
  const location = globalThis.location;
  if (!location || typeof location.origin !== 'string') {
    return null;
  }
  return { origin: location.origin, pathname: location.pathname };
}

export function buildSquareShareUrl(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  const webLocation = getWebLocation();
  if (webLocation) {
    const prefix = webLocation.pathname.startsWith(TEST_WEB_BASE_PATH)
      ? TEST_WEB_BASE_PATH
      : '';
    return `${webLocation.origin}${prefix}${normalized}`;
  }
  return `${WEB_PUBLIC_ORIGIN}${TEST_WEB_BASE_PATH}${normalized}`;
}
