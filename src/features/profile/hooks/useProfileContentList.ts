import {
  getMyAsks,
  getMyCollectionAsks,
  getMyCollectionComments,
  getMyCollectionStories,
  getMyComments,
  getMyFlowersSent,
  getMyResonateAsks,
  getMyResonateComments,
  getMyResonateShares,
  getMyResonateStories,
  getMyShares,
  getMyStories,
} from '@/src/features/profile/api';
import { PROFILE_QUERY_KEYS } from '@/src/features/profile/constants';
import { useProfileInfiniteQuery } from '@/src/features/profile/hooks/useProfileInfiniteQuery';
import type { ProfileContentTabId } from '@/src/features/profile/constants';

interface UseProfileContentListParams {
  main: ProfileContentTabId;
  publishSub: 'story' | 'share' | 'ask';
  collectSub: 'story' | 'ask' | 'comment';
  resonateSub: 'story' | 'ask' | 'share' | 'comment';
}

export function useProfileContentList({
  main,
  publishSub,
  collectSub,
  resonateSub,
}: UseProfileContentListParams) {
  const stories = useProfileInfiniteQuery(
    PROFILE_QUERY_KEYS.myStories,
    getMyStories,
    main === 'publish' && publishSub === 'story',
  );
  const shares = useProfileInfiniteQuery(
    PROFILE_QUERY_KEYS.myShares,
    getMyShares,
    main === 'publish' && publishSub === 'share',
  );
  const asks = useProfileInfiniteQuery(
    PROFILE_QUERY_KEYS.myAsks,
    getMyAsks,
    main === 'publish' && publishSub === 'ask',
  );
  const comments = useProfileInfiniteQuery(
    PROFILE_QUERY_KEYS.myComments,
    getMyComments,
    main === 'comment',
  );
  const flowersSent = useProfileInfiniteQuery(
    PROFILE_QUERY_KEYS.myFlowersSent,
    getMyFlowersSent,
    main === 'flower',
  );
  const collectStories = useProfileInfiniteQuery(
    PROFILE_QUERY_KEYS.myCollections('stories'),
    getMyCollectionStories,
    main === 'collect' && collectSub === 'story',
  );
  const collectAsks = useProfileInfiniteQuery(
    PROFILE_QUERY_KEYS.myCollections('asks'),
    getMyCollectionAsks,
    main === 'collect' && collectSub === 'ask',
  );
  const collectComments = useProfileInfiniteQuery(
    PROFILE_QUERY_KEYS.myCollections('comments'),
    getMyCollectionComments,
    main === 'collect' && collectSub === 'comment',
  );
  const resonateStories = useProfileInfiniteQuery(
    PROFILE_QUERY_KEYS.myResonates('stories'),
    getMyResonateStories,
    main === 'resonate' && resonateSub === 'story',
  );
  const resonateAsks = useProfileInfiniteQuery(
    PROFILE_QUERY_KEYS.myResonates('asks'),
    getMyResonateAsks,
    main === 'resonate' && resonateSub === 'ask',
  );
  const resonateShares = useProfileInfiniteQuery(
    PROFILE_QUERY_KEYS.myResonates('shares'),
    getMyResonateShares,
    main === 'resonate' && resonateSub === 'share',
  );
  const resonateComments = useProfileInfiniteQuery(
    PROFILE_QUERY_KEYS.myResonates('comments'),
    getMyResonateComments,
    main === 'resonate' && resonateSub === 'comment',
  );

  if (main === 'publish') {
    if (publishSub === 'share') return { kind: 'shares' as const, ...shares };
    if (publishSub === 'ask') return { kind: 'asks' as const, ...asks };
    return { kind: 'stories' as const, ...stories };
  }
  if (main === 'comment') {
    return { kind: 'comments' as const, ...comments };
  }
  if (main === 'flower') {
    return { kind: 'flowersSent' as const, ...flowersSent };
  }
  if (main === 'collect') {
    if (collectSub === 'ask') return { kind: 'asks' as const, ...collectAsks };
    if (collectSub === 'comment') return { kind: 'comments' as const, ...collectComments };
    return { kind: 'stories' as const, ...collectStories };
  }
  if (resonateSub === 'ask') return { kind: 'asks' as const, ...resonateAsks };
  if (resonateSub === 'share') return { kind: 'shares' as const, ...resonateShares };
  if (resonateSub === 'comment') return { kind: 'comments' as const, ...resonateComments };
  return { kind: 'stories' as const, ...resonateStories };
}
