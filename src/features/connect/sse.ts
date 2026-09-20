import { API_BASE_URL, API_PATHS, AUTH_HEADER_PREFIX } from '@/src/services/config';
import { getAccessToken } from '@/src/utils/tokenStorage';

import type { AiStreamRequest } from './types';

export interface AiStreamHandlers {
  onStart: (assistantMessageId: string) => void;
  onDelta: (assistantMessageId: string, text: string) => void;
  onDone: (assistantMessageId: string, content: string) => void;
  onError: (message: string, assistantMessageId?: string) => void;
}

interface JsonMap {
  [key: string]: string | number | boolean | null | undefined;
}

const SSE_EVENT_PREFIX = 'event:';
const SSE_DATA_PREFIX = 'data:';

function isJsonMap(value: object): value is JsonMap {
  return !Array.isArray(value);
}

function readJsonMap(raw: string): JsonMap | null {
  try {
    const parsed: object = JSON.parse(raw) as object;
    if (typeof parsed !== 'object' || parsed === null || !isJsonMap(parsed)) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function readString(map: JsonMap, key: string): string | undefined {
  const value = map[key];
  return typeof value === 'string' ? value : undefined;
}

function dispatchSse(eventName: string, raw: string, handlers: AiStreamHandlers): void {
  const map = readJsonMap(raw);
  if (!map) {
    return;
  }
  const assistantMessageId = readString(map, 'assistantMessageId');
  if (eventName === 'start' && assistantMessageId) {
    handlers.onStart(assistantMessageId);
    return;
  }
  if (eventName === 'delta' && assistantMessageId) {
    handlers.onDelta(assistantMessageId, readString(map, 'text') ?? '');
    return;
  }
  if (eventName === 'done' && assistantMessageId) {
    handlers.onDone(assistantMessageId, readString(map, 'content') ?? '');
    return;
  }
  if (eventName === 'error') {
    handlers.onError(readString(map, 'message') ?? '生成失败', assistantMessageId);
  }
}

function consumeSseBuffer(buffer: string, handlers: AiStreamHandlers): string {
  const blocks = buffer.split('\n\n');
  const rest = blocks.pop() ?? '';
  blocks.forEach((block) => {
    let eventName = 'message';
    const dataLines: string[] = [];
    block.split('\n').forEach((line) => {
      if (line.startsWith(SSE_EVENT_PREFIX)) {
        eventName = line.slice(SSE_EVENT_PREFIX.length).trim();
      } else if (line.startsWith(SSE_DATA_PREFIX)) {
        dataLines.push(line.slice(SSE_DATA_PREFIX.length).trim());
      }
    });
    if (dataLines.length > 0) {
      dispatchSse(eventName, dataLines.join('\n'), handlers);
    }
  });
  return rest;
}

async function readFetchStream(
  response: Response,
  handlers: AiStreamHandlers,
  signal: AbortSignal,
): Promise<void> {
  const reader = response.body?.getReader();
  if (!reader) {
    const text = await response.text();
    consumeSseBuffer(`${text}\n\n`, handlers);
    return;
  }
  const decoder = new TextDecoder();
  let buffer = '';
  while (!signal.aborted) {
    const chunk = await reader.read();
    if (chunk.done) {
      break;
    }
    buffer += decoder.decode(chunk.value, { stream: true });
    buffer = consumeSseBuffer(buffer, handlers);
  }
  if (buffer.trim().length > 0) {
    consumeSseBuffer(`${buffer}\n\n`, handlers);
  }
}

export async function streamAiChat(
  payload: AiStreamRequest,
  handlers: AiStreamHandlers,
  signal: AbortSignal,
): Promise<void> {
  const token = await getAccessToken();
  const response = await fetch(`${API_BASE_URL}${API_PATHS.CONNECT_AI_STREAM}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'text/event-stream',
      ...(token ? { Authorization: `${AUTH_HEADER_PREFIX} ${token}` } : {}),
    },
    body: JSON.stringify(payload),
    signal,
  });
  if (!response.ok) {
    const text = await response.text();
    const map = readJsonMap(text);
    throw new Error(map ? (readString(map, 'message') ?? '对话失败') : '对话失败');
  }
  await readFetchStream(response, handlers, signal);
}
