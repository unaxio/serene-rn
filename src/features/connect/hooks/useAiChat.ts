import { useCallback, useEffect, useRef, useState } from 'react';

import { streamAiChat } from '@/src/features/connect/sse';
import type { AiChatBubble, AiChatSession } from '@/src/features/connect/types';
import { readAiSessionDraft } from '@/src/features/connect/utils/aiSessionDraft';
import { toastCaughtFailure } from '@/src/utils/requestError';
import { showToast } from '@/src/utils/toast';

const PENDING_PREFIX = 'pending-';

function isAbortError(error: unknown): boolean {
  return error instanceof Error && error.name === 'AbortError';
}

function seedBubbles(draft: AiChatSession | null): AiChatBubble[] {
  if (!draft) {
    return [];
  }
  if (draft.messages && draft.messages.length > 0) {
    return draft.messages.map((item) => ({
      id: item.id,
      role: item.role,
      content: item.content,
    }));
  }
  if (draft.opening) {
    return [{ id: draft.opening.id, role: 'assistant', content: draft.opening.content }];
  }
  return [];
}

export function useAiChat(sessionId: string) {
  const draft = readAiSessionDraft(sessionId);
  const [messages, setMessages] = useState<AiChatBubble[]>(() => seedBubbles(draft));
  const [generating, setGenerating] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const localIdRef = useRef(0);

  useEffect(
    () => () => {
      abortRef.current?.abort();
    },
    [],
  );

  const replaceBubble = useCallback((fromId: string, patch: Partial<AiChatBubble> & { id?: string }) => {
    setMessages((current) =>
      current.map((item) => (item.id === fromId ? { ...item, ...patch, id: patch.id ?? item.id } : item)),
    );
  }, []);

  const runStream = useCallback(
    async (content: string, options?: { bubbleId?: string; retryAssistantId?: string; retryContent?: string }) => {
      const controller = new AbortController();
      abortRef.current?.abort();
      abortRef.current = controller;
      localIdRef.current += 1;
      let assistantId = options?.bubbleId ?? `${PENDING_PREFIX}${localIdRef.current}`;
      setGenerating(true);
      if (options?.bubbleId) {
        replaceBubble(options.bubbleId, { content: '', failed: false, pending: true });
      } else {
        const userId = `user-${localIdRef.current}`;
        setMessages((current) => [
          ...current,
          { id: userId, role: 'user', content },
          { id: assistantId, role: 'assistant', content: '', pending: true, retryContent: content },
        ]);
      }
      try {
        await streamAiChat(
          {
            sessionId,
            content: options?.retryContent ?? content,
            retryAssistantId: options?.retryAssistantId,
          },
          {
            onStart: (id) => {
              replaceBubble(assistantId, { id, pending: true });
              assistantId = id;
            },
            onDelta: (id, text) => {
              setMessages((current) =>
                current.map((item) =>
                  item.id === id || item.id === assistantId
                    ? { ...item, id, content: `${item.content}${text}`, pending: true }
                    : item,
                ),
              );
            },
            onDone: (id, full) => {
              replaceBubble(id === assistantId ? assistantId : id, {
                id,
                content: full,
                pending: false,
                failed: false,
              });
              assistantId = id;
            },
            onError: (message, id) => {
              showToast(message);
              replaceBubble(id ?? assistantId, { id: id ?? assistantId, pending: false, failed: true });
            },
          },
          controller.signal,
        );
      } catch (error) {
        if (controller.signal.aborted || isAbortError(error)) {
          return;
        }
        toastCaughtFailure(error);
        replaceBubble(assistantId, { pending: false, failed: true });
      } finally {
        if (abortRef.current === controller) {
          setGenerating(false);
        }
      }
    },
    [replaceBubble, sessionId],
  );

  const retry = useCallback(
    (bubble: AiChatBubble) => {
      if (!bubble.retryContent || generating) {
        return;
      }
      const retryAssistantId = bubble.id.startsWith(PENDING_PREFIX) ? undefined : bubble.id;
      void runStream(bubble.retryContent, {
        bubbleId: bubble.id,
        retryAssistantId,
        retryContent: bubble.retryContent,
      });
    },
    [generating, runStream],
  );

  return {
    ready: draft !== null,
    roleName: draft?.role.name ?? 'AI 陪我聊',
    messages,
    generating,
    send: runStream,
    retry,
    abort: () => abortRef.current?.abort(),
  };
}
