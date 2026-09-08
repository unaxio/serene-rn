import type { ComponentProps } from 'react';
import type { SymbolView } from 'expo-symbols';

export type ContentMoreKind = 'story' | 'ask' | 'ask_answer' | 'share';

export type ContentMoreActionId =
  | 'share'
  | 'promote'
  | 'follow'
  | 'unfollow'
  | 'message'
  | 'report'
  | 'notInterested'
  | 'edit'
  | 'delete';

export type ContentMoreSymbolName = ComponentProps<typeof SymbolView>['name'];

export interface ContentMoreAction {
  id: ContentMoreActionId;
  label: string;
  icon: ContentMoreSymbolName;
}

interface BuildContentMoreActionsParams {
  isOwn: boolean;
  contentKind: ContentMoreKind;
  isFollowing?: boolean;
}

const SHARE_ICON: ContentMoreSymbolName = {
  ios: 'square.and.arrow.up',
  android: 'share',
  web: 'share',
};

const PROMOTE_ICON: ContentMoreSymbolName = {
  ios: 'megaphone',
  android: 'campaign',
  web: 'campaign',
};

export function buildContentMoreActions({
  isOwn,
  isFollowing = false,
}: BuildContentMoreActionsParams): ContentMoreAction[] {
  if (isOwn) {
    return [
      { id: 'promote', label: '推广', icon: PROMOTE_ICON },
      { id: 'share', label: '分享', icon: SHARE_ICON },
      {
        id: 'edit',
        label: '编辑',
        icon: { ios: 'pencil', android: 'edit', web: 'edit' },
      },
      {
        id: 'delete',
        label: '删除',
        icon: { ios: 'trash', android: 'delete', web: 'delete' },
      },
    ];
  }

  return [
    { id: 'share', label: '内容分享', icon: SHARE_ICON },
    { id: 'promote', label: '推广', icon: PROMOTE_ICON },
    isFollowing
      ? {
          id: 'unfollow',
          label: '取消关注',
          icon: { ios: 'person.badge.minus', android: 'person_remove', web: 'person_remove' },
        }
      : {
          id: 'follow',
          label: '关注',
          icon: { ios: 'person.badge.plus', android: 'person_add', web: 'person_add' },
        },
    {
      id: 'message',
      label: '私信',
      icon: { ios: 'message', android: 'chat', web: 'chat' },
    },
    {
      id: 'report',
      label: '举报',
      icon: { ios: 'flag', android: 'flag', web: 'flag' },
    },
    {
      id: 'notInterested',
      label: '不感兴趣',
      icon: { ios: 'eye.slash', android: 'visibility_off', web: 'visibility_off' },
    },
  ];
}

export function isOwnAuthor(
  authorId: string | null | undefined,
  currentUserId: string | null | undefined,
): boolean {
  if (!authorId || !currentUserId) {
    return false;
  }
  return authorId === currentUserId;
}
