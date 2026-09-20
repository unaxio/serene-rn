import { SQUARE_PAGE_SIZE } from '@/src/features/square/constants';
import type {
  SquareAuthor,
  SquareComment,
  SquarePagedData,
  Share,
  ShareVisibleRange,
  Story,
  Ask,
  AskAnswer,
  AskAnswerDetail,
  SquareSearchItem,
  SquareSearchPage,
  SquareSearchType,
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
  mentions?: CommentMentionRaw[];
  topReplies?: CommentRaw[];
  parentAuthor?: SquareAuthor | null;
  createdAt?: string;
}

interface CommentMentionRaw {
  userId?: string;
  nickName?: string;
  start?: number;
  end?: number;
}

export function toEntityId(raw: { id?: string; _id?: string } | null | undefined): string {
  return raw?.id ?? raw?._id ?? '';
}

interface AuthorRaw {
  id?: string | null;
  _id?: string | null;
  userId?: string | null;
  nickName?: string | null;
  avatarUrl?: string | null;
  level?: string | number | null;
}

export function normalizeAuthor(raw: AuthorRaw | null | undefined): SquareAuthor {
  const id = (raw?.id ?? raw?._id ?? raw?.userId ?? '').trim();
  return {
    id: id.length > 0 ? id : null,
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

const SHARE_VISIBLE_RANGES: ShareVisibleRange[] = ['public', 'friends', 'private'];

export interface ShareRaw {
  id?: string;
  _id?: string;
  content?: string;
  images?: string[] | null;
  topicTag?: string | null;
  visibleRange?: string | null;
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

function normalizeVisibleRange(value: string | null | undefined): ShareVisibleRange {
  if (value && SHARE_VISIBLE_RANGES.includes(value as ShareVisibleRange)) {
    return value as ShareVisibleRange;
  }
  return 'public';
}

export function normalizeShare(raw: ShareRaw): Share {
  return {
    id: toEntityId(raw),
    content: raw.content ?? '',
    images: (raw.images ?? []).map((item) => item.trim()).filter((item) => item.length > 0),
    topicTag: raw.topicTag?.trim() ? raw.topicTag.trim() : null,
    visibleRange: normalizeVisibleRange(raw.visibleRange),
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

function normalizeMentions(content: string, raw: CommentMentionRaw[] | null | undefined): SquareComment['mentions'] {
  return (raw ?? []).flatMap((item) => {
    const userId = item.userId?.trim() ?? '';
    const nickName = item.nickName ?? '';
    const start = item.start ?? -1;
    const end = item.end ?? -1;
    if (!userId || start < 0 || end <= start || content.slice(start, end) !== `@${nickName}`) {
      return [];
    }
    return [{ userId, nickName, start, end }];
  });
}

export function normalizeComment(raw: CommentRaw): SquareComment {
  const id = toEntityId(raw);
  const content = raw.content ?? '';
  return {
    id,
    content,
    mentions: normalizeMentions(content, raw.mentions),
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

export interface AskRaw {
  id?: string;
  _id?: string;
  title?: string;
  content?: string;
  topicTag?: string | null;
  author?: SquareAuthor | null;
  answerCount?: number;
  viewCount?: number;
  commentCount?: number;
  resonateCount?: number;
  collectCount?: number;
  isResonated?: boolean;
  isCollected?: boolean;
  answerSummary?: string | { content?: string } | null;
  answererAvatar?: string | SquareAuthor | null;
  createdAt?: string;
}

export interface AskAnswerRaw {
  id?: string;
  _id?: string;
  askId?: string;
  content?: string;
  author?: SquareAuthor | null;
  resonateCount?: number;
  collectCount?: number;
  flowerCount?: number;
  commentCount?: number;
  isResonated?: boolean;
  isCollected?: boolean;
  isFlowered?: boolean;
  createdAt?: string;
  ask?: AskRaw;
}

function resolveAnswerSummary(
  raw: AskRaw['answerSummary'],
): string | null {
  if (!raw) {
    return null;
  }
  if (typeof raw === 'string') {
    const text = raw.trim();
    return text.length > 0 ? resolveStorySummary(undefined, text) : null;
  }
  const text = raw.content?.trim();
  return text && text.length > 0 ? resolveStorySummary(undefined, text) : null;
}

function resolveAnswererAvatar(
  raw: AskRaw['answererAvatar'],
): string | null {
  if (!raw) {
    return null;
  }
  if (typeof raw === 'string') {
    const path = raw.trim();
    return path.length > 0 ? path : null;
  }
  const path = raw.avatarUrl?.trim();
  return path && path.length > 0 ? path : null;
}

export function normalizeAsk(raw: AskRaw): Ask {
  return {
    id: toEntityId(raw),
    title: raw.title ?? '',
    content: raw.content ?? '',
    topicTag: raw.topicTag?.trim() ? raw.topicTag.trim() : null,
    author: normalizeAuthor(raw.author),
    answerCount: raw.answerCount ?? 0,
    viewCount: raw.viewCount ?? 0,
    commentCount: raw.commentCount ?? 0,
    resonateCount: raw.resonateCount ?? 0,
    collectCount: raw.collectCount ?? 0,
    isResonated: raw.isResonated ?? false,
    isCollected: raw.isCollected ?? false,
    answerSummary: resolveAnswerSummary(raw.answerSummary),
    answererAvatar: resolveAnswererAvatar(raw.answererAvatar),
    createdAt: raw.createdAt ?? '',
  };
}

export function normalizeAskAnswer(raw: AskAnswerRaw): AskAnswer {
  return {
    id: toEntityId(raw),
    askId: raw.askId ?? '',
    content: raw.content ?? '',
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

export function normalizeAskAnswerDetail(raw: AskAnswerRaw): AskAnswerDetail {
  if (!raw.ask) {
    throw new Error('回答详情缺少问题信息');
  }
  return {
    ...normalizeAskAnswer(raw),
    ask: normalizeAsk(raw.ask),
  };
}

const SEARCH_TYPES: SquareSearchType[] = ['story', 'share', 'ask'];

export interface SearchItemRaw {
  type?: string;
  id?: string;
  _id?: string;
  title?: string;
  content?: string;
  coverImage?: string | null;
  createdAt?: string;
  author?: SquareAuthor | null;
}

interface SearchPageRaw {
  items?: SearchItemRaw[];
  size?: number;
}

function isSearchType(value: string): value is SquareSearchType {
  return SEARCH_TYPES.includes(value as SquareSearchType);
}

export function normalizeSearchItem(raw: SearchItemRaw): SquareSearchItem | null {
  const type = raw.type ?? '';
  if (!isSearchType(type)) {
    return null;
  }
  const id = toEntityId(raw);
  if (id.length === 0) {
    return null;
  }
  const coverImage = raw.coverImage?.trim();
  return {
    type,
    id,
    title: raw.title ?? '',
    content: raw.content ?? '',
    coverImage: coverImage && coverImage.length > 0 ? coverImage : null,
    createdAt: raw.createdAt ?? '',
    author: normalizeAuthor(raw.author),
  };
}

export function normalizeSearchPage(raw: SearchPageRaw, fallbackSize: number): SquareSearchPage {
  const items = (raw.items ?? [])
    .map(normalizeSearchItem)
    .filter((item): item is SquareSearchItem => item !== null);
  return {
    items,
    size: raw.size ?? fallbackSize,
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
