import type { QueryClient } from '@tanstack/react-query';

import { deleteStory } from '@/src/features/square/api';
import { deleteAsk, deleteAskAnswer } from '@/src/features/square/askApi';
import { SQUARE_QUERY_KEYS } from '@/src/features/square/constants';
import { deleteShare } from '@/src/features/square/shareApi';
import type { ContentMoreKind } from '@/src/features/square/utils/contentMoreActions';

const PROFILE_ME_CONTENTS_QUERY_ROOT = ['profile', 'me', 'contents'] as const;

export async function deleteContentByKind(
  contentKind: ContentMoreKind,
  targetId: string,
): Promise<void> {
  switch (contentKind) {
    case 'story':
      await deleteStory(targetId);
      return;
    case 'share':
      await deleteShare(targetId);
      return;
    case 'ask':
      await deleteAsk(targetId);
      return;
    case 'ask_answer':
      await deleteAskAnswer(targetId);
  }
}

export async function invalidateAfterContentDelete(
  queryClient: QueryClient,
  contentKind: ContentMoreKind,
  targetId: string,
  askId?: string | null,
): Promise<void> {
  await queryClient.invalidateQueries({ queryKey: PROFILE_ME_CONTENTS_QUERY_ROOT });
  switch (contentKind) {
    case 'story':
      await queryClient.invalidateQueries({ queryKey: ['square', 'stories'] });
      queryClient.removeQueries({ queryKey: SQUARE_QUERY_KEYS.storyDetail(targetId) });
      return;
    case 'share':
      await queryClient.invalidateQueries({ queryKey: SQUARE_QUERY_KEYS.shares });
      queryClient.removeQueries({ queryKey: SQUARE_QUERY_KEYS.shareDetail(targetId) });
      return;
    case 'ask':
      await queryClient.invalidateQueries({ queryKey: SQUARE_QUERY_KEYS.asks });
      queryClient.removeQueries({ queryKey: SQUARE_QUERY_KEYS.askDetail(targetId) });
      return;
    case 'ask_answer':
      await queryClient.invalidateQueries({ queryKey: ['square', 'askAnswers'] });
      queryClient.removeQueries({ queryKey: SQUARE_QUERY_KEYS.askAnswerDetail(targetId) });
      if (askId) {
        await queryClient.invalidateQueries({
          queryKey: SQUARE_QUERY_KEYS.askDetail(askId),
        });
      }
  }
}
