import type { FollowRelation } from '@/src/features/follow/types';

export function getFollowActionLabel(relation: FollowRelation | undefined): string {
  if (relation === 'mutual') {
    return '互相关注';
  }
  if (relation === 'following') {
    return '已关注';
  }
  if (relation === 'followed_by') {
    return '回关';
  }
  return '关注';
}

export function isFollowActionPrimary(relation: FollowRelation | undefined): boolean {
  return relation !== 'following' && relation !== 'mutual';
}

export function shouldFollowNext(relation: FollowRelation | undefined): boolean {
  return relation !== 'following' && relation !== 'mutual';
}
