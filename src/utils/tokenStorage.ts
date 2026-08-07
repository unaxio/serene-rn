import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

import { STORAGE_KEYS } from '@/src/services/config';

const isWeb = Platform.OS === 'web';

/**
 * Web 不支持 SecureStore，回退到 localStorage；
 * 原生端使用 SecureStore（Keychain / Keystore）。
 */
export async function getAccessToken(): Promise<string | null> {
  try {
    if (isWeb) {
      return globalThis.localStorage?.getItem(STORAGE_KEYS.ACCESS_TOKEN) ?? null;
    }
    return await SecureStore.getItemAsync(STORAGE_KEYS.ACCESS_TOKEN);
  } catch {
    return null;
  }
}

export async function setAccessToken(token: string): Promise<void> {
  try {
    if (isWeb) {
      globalThis.localStorage?.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
      return;
    }
    await SecureStore.setItemAsync(STORAGE_KEYS.ACCESS_TOKEN, token);
  } catch (error) {
    console.error('[tokenStorage] Failed to persist access token', error);
    throw error;
  }
}

export async function clearAccessToken(): Promise<void> {
  try {
    if (isWeb) {
      globalThis.localStorage?.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      return;
    }
    await SecureStore.deleteItemAsync(STORAGE_KEYS.ACCESS_TOKEN);
  } catch (error) {
    console.error('[tokenStorage] Failed to clear access token', error);
  }
}
