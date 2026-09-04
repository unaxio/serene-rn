import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';

import {
  API_BASE_URL,
  AUTH_HEADER_PREFIX,
  HTTP_STATUS,
  REQUEST_TIMEOUT_MS,
} from '@/src/services/config';
import { toastAxiosFailure } from '@/src/utils/requestError';

type TokenGetter = () => string | null;
type UnauthorizedHandler = () => void;

let getAccessToken: TokenGetter = () => null;
let onUnauthorized: UnauthorizedHandler | null = null;

/** 由 Auth Store 注入，供请求拦截器同步读取内存中的 Token */
export function setAccessTokenGetter(getter: TokenGetter): void {
  getAccessToken = getter;
}

/** 供 Auth 模块注册 401 时的统一处理（打开登录框、清会话） */
export function setUnauthorizedHandler(handler: UnauthorizedHandler): void {
  onUnauthorized = handler;
}

function attachAuthHeader(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
  const accessToken = getAccessToken();
  if (accessToken) {
    config.headers.Authorization = `${AUTH_HEADER_PREFIX} ${accessToken}`;
  }
  return config;
}

function handleResponseError(error: AxiosError): Promise<never> {
  if (error.response?.status === HTTP_STATUS.UNAUTHORIZED) {
    onUnauthorized?.();
  } else {
    toastAxiosFailure(error);
  }

  return Promise.reject(error);
}

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: REQUEST_TIMEOUT_MS,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(attachAuthHeader, (error: AxiosError) =>
  Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  handleResponseError,
);

async function sendRequest<T>(config: AxiosRequestConfig): Promise<T> {
  const response = await axiosInstance.request<T>(config);
  return response.data;
}

export const request = {
  get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return sendRequest<T>({ ...config, method: 'GET', url });
  },
  post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return sendRequest<T>({ ...config, method: 'POST', url, data });
  },
  put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return sendRequest<T>({ ...config, method: 'PUT', url, data });
  },
  patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return sendRequest<T>({ ...config, method: 'PATCH', url, data });
  },
  delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return sendRequest<T>({ ...config, method: 'DELETE', url });
  },
};

export default request;
