import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  getDmMessages,
  hideDmMessage,
  markDmRead,
  sendDmMessage,
} from '@/src/features/connect/api';
import { CONNECT_BLOCKED_HINT, CONNECT_PAGE_SIZE, CONNECT_QUERY_KEYS } from '@/src/features/connect/constants';
import type { DmMessage, DmQuote } from '@/src/features/connect/types';
import { DM_TEXT_MESSAGE_TYPE, dmMessageText } from '@/src/features/connect/utils/dmMessageText';
import { toastCaughtFailure } from '@/src/utils/requestError';

export function useDmThread(conversationId: string) {
  const queryClient = useQueryClient();
  const [quote, setQuote] = useState<DmQuote | null>(null);
  const query = useInfiniteQuery({
    queryKey: CONNECT_QUERY_KEYS.dmMessages(conversationId),
    queryFn: ({ pageParam }) => getDmMessages(conversationId, pageParam, CONNECT_PAGE_SIZE),
    initialPageParam: 1,
    enabled: conversationId.length > 0,
    getNextPageParam: (lastPage) =>
      lastPage.page * lastPage.pageSize < lastPage.total ? lastPage.page + 1 : undefined,
  });

  const messages = useMemo(() => {
    const pages = query.data?.pages ?? [];
    return [...pages].reverse().flatMap((page) => page.items);
  }, [query.data?.pages]);

  const conversation = query.data?.pages[0]?.conversation;
  const blocked = Boolean(conversation?.blockedByMe || conversation?.blockedMe);
  const inputHint = conversation?.inputHint?.trim() || (blocked ? CONNECT_BLOCKED_HINT : '');

  useEffect(() => {
    if (conversationId.length === 0) {
      return;
    }
    let cancelled = false;
    void (async () => {
      try {
        await markDmRead(conversationId);
        if (cancelled) {
          return;
        }
        await queryClient.invalidateQueries({ queryKey: CONNECT_QUERY_KEYS.unread });
        await queryClient.invalidateQueries({ queryKey: CONNECT_QUERY_KEYS.home });
      } catch {
        // 已读失败不打断聊天
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [conversationId, queryClient]);

  const refresh = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: CONNECT_QUERY_KEYS.dmMessages(conversationId) });
    await queryClient.invalidateQueries({ queryKey: CONNECT_QUERY_KEYS.home });
  }, [conversationId, queryClient]);

  const sendText = useCallback(
    async (content: string) => {
      try {
        await sendDmMessage(conversationId, {
          messageType: DM_TEXT_MESSAGE_TYPE,
          payload: { text: content },
          quoteMessageId: quote?.id,
        });
        setQuote(null);
        await refresh();
      } catch (error) {
        toastCaughtFailure(error);
      }
    },
    [conversationId, quote?.id, refresh],
  );

  const hide = useCallback(
    async (messageId: string) => {
      try {
        await hideDmMessage(conversationId, messageId);
        await refresh();
      } catch (error) {
        toastCaughtFailure(error);
      }
    },
    [conversationId, refresh],
  );

  const quoteMessage = useCallback((message: DmMessage) => {
    setQuote({
      id: message.id,
      senderName: '',
      summary: dmMessageText(message),
      missing: false,
    });
  }, []);

  return {
    messages,
    conversation,
    blocked: blocked || inputHint.length > 0,
    inputHint,
    quote,
    clearQuote: () => setQuote(null),
    quoteMessage,
    isLoading: query.isLoading,
    isError: query.isError,
    isRefreshing: query.isRefetching && !query.isFetchingNextPage,
    refresh: query.refetch,
    loadOlder: () => {
      if (query.hasNextPage && !query.isFetchingNextPage) {
        void query.fetchNextPage();
      }
    },
    sendText,
    hide,
  };
}
