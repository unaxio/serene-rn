import { SQUARE_PAGE_SIZE } from '@/src/features/square/constants';
import type {
  SquareAuthor,
  SquareComment,
  SquarePagedData,
  Story,
} from '@/src/features/square/types';
import { resolveStorySummary } from '@/src/features/square/utils/storySummary';

export interface StoryRaw {
  id?: string;
  _id?: string;
  title?: string;
  content?: string;
  summary?: string;
  topicTag?: string | null;
  tags?: string[] | null;
  coverImagePath?: string | null;
  coverImage?: string | null;
  author?: SquareAuthor | null;
  resonateCount?: number;
  collectCount?: number;
  flowerCount?: number;
  commentCount?: number;
  isResonated?: boolean;
  isCollected?: boolean;
  isFlowered?: boolean;
  createdAt?: string;
}

export interface CommentRaw {
  id?: string;
  _id?: string;
  content?: string;
  author?: SquareAuthor | null;
  parentId?: string | null;
  rootId?: string;
  replyCount?: number;
  resonateCount?: number;
  collectCount?: number;
  flowerCount?: number;
  isResonated?: boolean;
  isCollected?: boolean;
  isFlowered?: boolean;
  topReplies?: CommentRaw[];
  parentAuthor?: SquareAuthor | null;
  createdAt?: string;
}

export function toEntityId(raw: { id?: string; _id?: string } | null | undefined): string {
  return raw?.id ?? raw?._id ?? '';
}

export function normalizeAuthor(raw: SquareAuthor | null | undefined): SquareAuthor {
  return {
    id: raw?.id ?? null,
    nickName: raw?.nickName ?? '',
    avatarUrl: raw?.avatarUrl ?? '',
    level: raw?.level ?? null,
  };
}

function resolveStoryTags(raw: StoryRaw): string[] {
  const fromList = (raw.tags ?? []).map((tag) => tag.trim()).filter((tag) => tag.length > 0);
  if (fromList.length > 0) {
    return fromList;
  }
  const topic = raw.topicTag?.trim();
  return topic ? [topic] : [];
}

export function normalizeStory(raw: StoryRaw): Story {
  const content = raw.content ?? '';
  return {
    id: toEntityId(raw),
    title: raw.title ?? '',
    content,
    summary: resolveStorySummary(raw.summary, content),
    topicTag: raw.topicTag ?? null,
    tags: resolveStoryTags(raw),
    coverImagePath: raw.coverImagePath ?? raw.coverImage ?? null,
    author: normalizeAuthor(raw.author),
    resonateCount: raw.resonateCount ?? 0,
    collectCount: raw.collectCount ?? 0,
    flowerCount: raw.flowerCount ?? 0,
    commentCount: raw.commentCount ?? 0,
    isResonated: raw.isResonated ?? false,
    isCollected: raw.isCollected ?? false,
    isFlowered: raw.isFlowered ?? false,
    createdAt: raw.createdAt ?? '',
  };
}

export function normalizeComment(raw: CommentRaw): SquareComment {
  const id = toEntityId(raw);
  return {
    id,
    content: raw.content ?? '',
    author: normalizeAuthor(raw.author),
    parentId: raw.parentId ?? null,
    rootId: raw.rootId ?? id,
    replyCount: raw.replyCount ?? 0,
    resonateCount: raw.resonateCount ?? 0,
    collectCount: raw.collectCount ?? 0,
    flowerCount: raw.flowerCount ?? 0,
    isResonated: raw.isResonated ?? false,
    isCollected: raw.isCollected ?? false,
    isFlowered: raw.isFlowered ?? false,
    topReplies: (raw.topReplies ?? []).map((item) =>
      normalizeComment({ ...item, rootId: item.rootId ?? id }),
    ),
    parentAuthor: raw.parentAuthor ? normalizeAuthor(raw.parentAuthor) : null,
    createdAt: raw.createdAt ?? '',
  };
}

export function unwrapPagedItems<TRaw, TItem>(
  data: SquarePagedData<TRaw>,
  mapItem: (item: TRaw) => TItem,
): SquarePagedData<TItem> {
  return {
    items: (data.items ?? []).map(mapItem),
    total: data.total ?? 0,
    page: data.page ?? 1,
    pageSize: data.pageSize ?? SQUARE_PAGE_SIZE,
  };
}
