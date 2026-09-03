import { useMutation, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { useCallback } from 'react';

import { createStory } from '@/src/features/square/api';
import { SQUARE_QUERY_KEYS } from '@/src/features/square/constants';
import type { CreateStoryPayload, Story } from '@/src/features/square/types';
import { useRequireAuth } from '@/src/features/square/hooks/useRequireAuth';
import { showErrorToast } from '@/src/utils/toast';

export function useCreateStory() {
  const requireAuth = useRequireAuth();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (payload: CreateStoryPayload) => createStory(payload),
  });

  const submit = useCallback(
    async (payload: CreateStoryPayload): Promise<Story | null> => {
      if (!requireAuth()) {
        return null;
      }
      try {
        const story = await mutation.mutateAsync(payload);
        if (story.id) {
          queryClient.setQueryData(SQUARE_QUERY_KEYS.storyDetail(story.id), story);
        }
        await queryClient.invalidateQueries({ queryKey: ['square', 'stories'] });
        return story;
      } catch (error) {
        if (!isAxiosError(error)) {
          const message = error instanceof Error ? error.message : '发布失败，请稍后重试';
          showErrorToast(message);
        }
        return null;
      }
    },
    [mutation, queryClient, requireAuth],
  );

  return {
    submit,
    isSubmitting: mutation.isPending,
  };
}
