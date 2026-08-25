export const FOLLOW_QUERY_KEYS = {
  following: ['follow', 'following'] as const,
  followers: ['follow', 'followers'] as const,
  search: (nickName: string) => ['follow', 'search', nickName] as const,
};
