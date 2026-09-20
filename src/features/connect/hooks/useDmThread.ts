import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo, useState } from 'react';

import {
  getDmMessages,
  hideDmMessage,
  sendDmMessage,
} from '@/src/features/connect/api';
import { CONNECT_PAGE_SIZE, CONNECT_QUERY_KEYS } from '@/src/features/connect/constants';
import type { DmMessage, DmQuote } from '@/src/features/connect/types';
import { uploadSquareImage } from '@/src/features/square/api';
import type { PickedImageFile } from '@/src/features/square/utils/pickSquareImage';
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

  const refresh = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: CONNECT_QUERY_KEYS.dmMessages(conversationId) });
    await queryClient.invalidateQueries({ queryKey: CONNECT_QUERY_KEYS.home });
  }, [conversationId, queryClient]);

  const sendText = useCallback(
    async (content: string) => {
      try {
        await sendDmMessage(conversationId, {
          kind: 'text',
          content,
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

  const sendImages = useCallback(
    async (files: PickedImageFile[]) => {
      try {
        const imagePaths: string[] = [];
        for (const file of files) {
          const uploaded = await uploadSquareImage(file);
          imagePaths.push(uploaded.relativePath);
        }
        await sendDmMessage(conversationId, {
          kind: 'image',
          imagePaths,
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
      summary: message.kind === 'image' ? '[图片]' : message.content,
      missing: false,
    });
  }, []);

  return {
    messages,
    conversation,
    blocked,
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
    sendImages,
    hide,
  };
}
