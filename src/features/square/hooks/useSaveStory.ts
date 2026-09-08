import { useMutation, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { useCallback } from 'react';

import { createStory, updateStory } from '@/src/features/square/api';
import { EDIT_SUCCESS_MESSAGE, SQUARE_QUERY_KEYS } from '@/src/features/square/constants';
import { useRequireAuth } from '@/src/features/square/hooks/useRequireAuth';
import type { CreateStoryPayload, Story } from '@/src/features/square/types';
import { showErrorToast, showToast } from '@/src/utils/toast';

export function useSaveStory(editId?: string | null) {
  const requireAuth = useRequireAuth();
  const queryClient = useQueryClient();
  const isEdit = Boolean(editId);

  const mutation = useMutation({
    mutationFn: (payload: CreateStoryPayload) =>
      isEdit && editId ? updateStory(editId, payload) : createStory(payload),
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
        if (isEdit) {
          showToast(EDIT_SUCCESS_MESSAGE);
        }
        return story;
      } catch (error) {
        if (!isAxiosError(error)) {
          const message = error instanceof Error ? error.message : '保存失败，请稍后重试';
          showErrorToast(message);
        }
        return null;
      }
    },
    [editId, isEdit, mutation, queryClient, requireAuth],
  );

  return {
    submit,
    isSubmitting: mutation.isPending,
    isEdit,
  };
}
