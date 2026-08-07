import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

import { getTodayTask, submitAnswer } from '@/src/features/soulFlower/api';
import { SOUL_FLOWER_QUERY_KEYS } from '@/src/features/soulFlower/constants';
import type { SubmitAnswerRequest } from '@/src/features/soulFlower/types';
import { showErrorToast, showToast } from '@/src/utils/toast';

export function useTodayTask() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: SOUL_FLOWER_QUERY_KEYS.todayTask,
    queryFn: getTodayTask,
  });

  const mutation = useMutation({
    mutationFn: (payload: SubmitAnswerRequest) => submitAnswer(payload),
    onSuccess: async (result) => {
      if (!result.success) {
        showErrorToast(result.message ?? '提交失败，请稍后重试');
        return;
      }

      showToast(result.message ?? '今日觉察已完成');
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: SOUL_FLOWER_QUERY_KEYS.todayTask }),
        queryClient.invalidateQueries({ queryKey: SOUL_FLOWER_QUERY_KEYS.mindMap }),
      ]);
    },
  });

  const handleSubmit = useCallback(
    async (questionId: string, answerContent: string) => {
      const trimmed = answerContent.trim();
      if (!trimmed) {
        showErrorToast('请先填写或选择你的回答');
        return;
      }
      await mutation.mutateAsync({ questionId, answerContent: trimmed });
    },
    [mutation],
  );

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    isSubmitting: mutation.isPending,
    submitAnswer: handleSubmit,
  };
}
