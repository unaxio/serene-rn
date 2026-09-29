import { API_PATHS } from '@/src/services/config';
import { request } from '@/src/services/request';
import { unwrapResponse, unwrapVoidResponse, type ApiEnvelope } from '@/src/features/square/api';
import type { SquarePagedData } from '@/src/features/square/types';
import {
  normalizeAsk,
  normalizeShare,
  normalizeStory,
  toEntityId,
  unwrapPagedItems,
  type AskRaw,
  type ShareRaw,
  type StoryRaw,
} from '@/src/features/square/utils/normalize';
import { resolveCdnUrl } from '@/src/utils/cdn';
import {
  normalizeProfileCity,
  type ProfileCityRaw,
} from '@/src/features/profile/utils/regionPath';

import type {
  AccountDevice,
  AccountSecurityInfo,
  BlacklistItem,
  FlowerReceivedLedgerItem,
  FlowerSentItem,
  GiftFlowerReceivedItem,
  HelpFaq,
  HelpFeedbackPayload,
  HelpTicket,
  MembershipInfo,
  NotificationSettings,
  PrivacySettings,
  ProfileAskItem,
  ProfileAuthor,
  ProfileCommentItem,
  ProfileDetail,
  ProfileHomeData,
  ProfileNotificationItem,
  ProfileShareItem,
  ProfileStoryItem,
  PromoteOrderPayload,
  PromoteOrderResult,
  PromotePlan,
  ResonateReceivedItem,
  UpdateProfilePayload,
  UserHomeData,
} from './types';

/** 列表接口统一：`data` 为 `{ items: T[] }`，兼容历史裸数组 */
function unwrapItemsList<T>(data: T[] | { items?: T[] } | null | undefined): T[] {
  if (Array.isArray(data)) {
    return data;
  }
  return data?.items ?? [];
}

function asAuthor(raw: Partial<ProfileAuthor> | null | undefined): ProfileAuthor {
  const rawAvatar = raw?.avatarUrl ?? '';
  return {
    id: raw?.id ?? '',
    nickName: raw?.nickName ?? '',
    avatarUrl: resolveCdnUrl(rawAvatar) ?? rawAvatar,
    level: raw?.level ?? null,
    identityTags: raw?.identityTags ?? [],
  };
}

interface ProfileDetailRaw extends Omit<ProfileDetail, 'city' | 'cityCode'> {
  cityCode?: string | null;
  city?: ProfileCityRaw | null;
}

interface ProfileHomeRaw extends Omit<ProfileHomeData, 'profile'> {
  profile: ProfileDetailRaw;
}

function normalizeHome(raw: ProfileHomeRaw): ProfileHomeData {
  const cityCode = raw.profile.cityCode?.trim() ?? '';
  return {
    profile: {
      ...raw.profile,
      avatarUrl:
        resolveCdnUrl(raw.profile.avatarUrl) ?? raw.profile.avatarUrl ?? '',
      identityTags: raw.profile.identityTags ?? [],
      bio: raw.profile.bio ?? '',
      region: raw.profile.region ?? null,
      cityCode: cityCode.length > 0 ? cityCode : null,
      city: normalizeProfileCity(raw.profile.city),
      relationshipStatus: raw.profile.relationshipStatus ?? null,
      ipLocation: raw.profile.ipLocation ?? null,
      level: raw.profile.level ?? null,
    },
    stats: {
      followingCount: raw.stats?.followingCount ?? 0,
      followerCount: raw.stats?.followerCount ?? 0,
      resonateReceivedCount: raw.stats?.resonateReceivedCount ?? 0,
      flowerReceivedCount: raw.stats?.flowerReceivedCount ?? 0,
      flowerSentCount: raw.stats?.flowerSentCount ?? 0,
    },
    recentReceivedFlowers: (raw.recentReceivedFlowers ?? []).map((item) => ({
      ...item,
      sender: asAuthor(item.sender),
      giftFlowerImagePath: item.giftFlowerImagePath ?? '',
    })),
    flowerCoin: raw.flowerCoin ?? 0,
  };
}

export async function getMeHome(): Promise<ProfileHomeData> {
  const response = await request.get<ProfileHomeRaw | ApiEnvelope<ProfileHomeRaw>>(
    API_PATHS.PROFILE_ME_HOME,
  );
  return normalizeHome(unwrapResponse(response, '获取我的主页失败'));
}

export async function getUserHome(userId: string): Promise<UserHomeData> {
  const response = await request.get<
    (ProfileHomeRaw & Partial<UserHomeData>) | ApiEnvelope<ProfileHomeRaw & Partial<UserHomeData>>
  >(`${API_PATHS.PROFILE_USER_HOME}/${userId}/home`);
  const data = unwrapResponse(response, '获取用户主页失败');
  return {
    ...normalizeHome(data),
    relation: data.relation ?? 'none',
    isBlockedByMe: data.isBlockedByMe ?? false,
    isBlockedMe: data.isBlockedMe ?? false,
  };
}

export async function updateMeProfile(payload: UpdateProfilePayload): Promise<void> {
  const response = await request.patch<unknown | ApiEnvelope<unknown>>(
    API_PATHS.PROFILE_ME_PROFILE,
    payload,
  );
  unwrapVoidResponse(response, '更新资料失败');
}

export async function uploadAvatar(file: {
  uri: string;
  name: string;
  type: string;
}): Promise<{ relativePath: string }> {
  const formData = new FormData();
  if (typeof Blob !== 'undefined' && file.uri.startsWith('blob:')) {
    const blobResponse = await fetch(file.uri);
    const blob = await blobResponse.blob();
    formData.append('file', blob, file.name);
  } else {
    formData.append('file', {
      uri: file.uri,
      name: file.name,
      type: file.type,
    } as unknown as Blob);
  }
  const response = await request.post<
    { relativePath: string } | ApiEnvelope<{ relativePath: string }>
  >(API_PATHS.PROFILE_AVATAR_UPLOAD, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return unwrapResponse(response, '上传头像失败');
}

export async function getResonateReceived(
  page: number,
  pageSize: number,
): Promise<SquarePagedData<ResonateReceivedItem>> {
  const response = await request.get<
    SquarePagedData<ResonateReceivedItem> | ApiEnvelope<SquarePagedData<ResonateReceivedItem>>
  >(API_PATHS.PROFILE_RESONATE_RECEIVED, { params: { page, pageSize } });
  const data = unwrapResponse(response, '获取获赞记录失败');
  return {
    items: (data.items ?? []).map((item) => ({
      ...item,
      fromUser: asAuthor(item.fromUser),
    })),
    total: data.total ?? 0,
    page: data.page ?? page,
    pageSize: data.pageSize ?? pageSize,
  };
}

export async function getGiftFlowersReceived(
  page: number,
  pageSize: number,
): Promise<SquarePagedData<GiftFlowerReceivedItem>> {
  const response = await request.get<
    SquarePagedData<GiftFlowerReceivedItem> | ApiEnvelope<SquarePagedData<GiftFlowerReceivedItem>>
  >(API_PATHS.GIFT_FLOWER_RECEIVED, { params: { page, pageSize } });
  const data = unwrapResponse(response, '获取获赠花失败');
  return {
    items: (data.items ?? []).map((item) => ({
      ...item,
      sender: asAuthor(item.sender),
    })),
    total: data.total ?? 0,
    page: data.page ?? page,
    pageSize: data.pageSize ?? pageSize,
  };
}

export async function getFlowersReceived(
  page: number,
  pageSize: number,
): Promise<SquarePagedData<FlowerReceivedLedgerItem>> {
  const response = await request.get<
    | SquarePagedData<FlowerReceivedLedgerItem>
    | ApiEnvelope<SquarePagedData<FlowerReceivedLedgerItem>>
  >(API_PATHS.PROFILE_FLOWERS_RECEIVED, { params: { page, pageSize } });
  const data = unwrapResponse(response, '获取收到的花失败');
  return {
    items: (data.items ?? []).map((item) => ({
      ...item,
      sender: asAuthor(item.sender),
    })),
    total: data.total ?? 0,
    page: data.page ?? page,
    pageSize: data.pageSize ?? pageSize,
  };
}

function withPinView(
  story: ReturnType<typeof normalizeStory>,
  raw: StoryRaw & { viewCount?: number; isPinned?: boolean },
): ProfileStoryItem {
  return { ...story, viewCount: raw.viewCount ?? 0, isPinned: raw.isPinned ?? false };
}

export async function getMyStories(
  page: number,
  pageSize: number,
): Promise<SquarePagedData<ProfileStoryItem>> {
  const response = await request.get<
    SquarePagedData<StoryRaw> | ApiEnvelope<SquarePagedData<StoryRaw>>
  >(`${API_PATHS.PROFILE_ME_CONTENTS}/stories`, { params: { page, pageSize } });
  return unwrapPagedItems(unwrapResponse(response, '获取我的故事失败'), (raw) =>
    withPinView(normalizeStory(raw), raw),
  );
}

export async function getMyShares(
  page: number,
  pageSize: number,
): Promise<SquarePagedData<ProfileShareItem>> {
  const response = await request.get<
    SquarePagedData<ShareRaw> | ApiEnvelope<SquarePagedData<ShareRaw>>
  >(`${API_PATHS.PROFILE_ME_CONTENTS}/shares`, { params: { page, pageSize } });
  return unwrapPagedItems(unwrapResponse(response, '获取我的分享失败'), (raw) => {
    const share = normalizeShare(raw);
    return {
      ...share,
      viewCount: (raw as ShareRaw & { viewCount?: number }).viewCount ?? 0,
      isPinned: (raw as ShareRaw & { isPinned?: boolean }).isPinned ?? false,
    };
  });
}

export async function getMyAsks(
  page: number,
  pageSize: number,
): Promise<SquarePagedData<ProfileAskItem>> {
  const response = await request.get<
    SquarePagedData<AskRaw> | ApiEnvelope<SquarePagedData<AskRaw>>
  >(`${API_PATHS.PROFILE_ME_CONTENTS}/asks`, { params: { page, pageSize } });
  return unwrapPagedItems(unwrapResponse(response, '获取我的问答失败'), (raw) => {
    const ask = normalizeAsk(raw);
    return {
      ...ask,
      viewCount: (raw as AskRaw & { viewCount?: number }).viewCount ?? ask.viewCount ?? 0,
      isPinned: (raw as AskRaw & { isPinned?: boolean }).isPinned ?? false,
    };
  });
}

export async function pinMyContent(
  targetType: 'story' | 'share' | 'ask',
  targetId: string,
): Promise<void> {
  const response = await request.post<unknown | ApiEnvelope<unknown>>(
    `${API_PATHS.PROFILE_ME_CONTENTS}/${targetType}/${targetId}/pin`,
  );
  unwrapVoidResponse(response, '置顶失败');
}

export async function unpinMyContent(
  targetType: 'story' | 'share' | 'ask',
  targetId: string,
): Promise<void> {
  const response = await request.delete<unknown | ApiEnvelope<unknown>>(
    `${API_PATHS.PROFILE_ME_CONTENTS}/${targetType}/${targetId}/pin`,
  );
  unwrapVoidResponse(response, '取消置顶失败');
}

export async function getMyComments(
  page: number,
  pageSize: number,
): Promise<SquarePagedData<ProfileCommentItem>> {
  const response = await request.get<
    SquarePagedData<ProfileCommentItem> | ApiEnvelope<SquarePagedData<ProfileCommentItem>>
  >(`${API_PATHS.PROFILE_ME_CONTENTS}/comments`, { params: { page, pageSize } });
  return unwrapResponse(response, '获取我的评论失败');
}

export async function getMyFlowersSent(
  page: number,
  pageSize: number,
): Promise<SquarePagedData<FlowerSentItem>> {
  const response = await request.get<
    SquarePagedData<FlowerSentItem> | ApiEnvelope<SquarePagedData<FlowerSentItem>>
  >(`${API_PATHS.PROFILE_ME_CONTENTS}/flowers-sent`, { params: { page, pageSize } });
  const data = unwrapResponse(response, '获取送花记录失败');
  return {
    ...data,
    items: (data.items ?? []).map((item) => ({
      ...item,
      receiver: asAuthor(item.receiver),
    })),
  };
}

export async function getMyCollectionStories(
  page: number,
  pageSize: number,
): Promise<SquarePagedData<ProfileStoryItem>> {
  const response = await request.get<
    SquarePagedData<StoryRaw> | ApiEnvelope<SquarePagedData<StoryRaw>>
  >(`${API_PATHS.PROFILE_ME_CONTENTS}/collections/stories`, { params: { page, pageSize } });
  return unwrapPagedItems(unwrapResponse(response, '获取收藏故事失败'), (raw) =>
    withPinView(normalizeStory(raw), raw),
  );
}

export async function getMyCollectionAsks(
  page: number,
  pageSize: number,
): Promise<SquarePagedData<ProfileAskItem>> {
  const response = await request.get<
    SquarePagedData<AskRaw> | ApiEnvelope<SquarePagedData<AskRaw>>
  >(`${API_PATHS.PROFILE_ME_CONTENTS}/collections/asks`, { params: { page, pageSize } });
  return unwrapPagedItems(unwrapResponse(response, '获取收藏问答失败'), (raw) => ({
    ...normalizeAsk(raw),
    viewCount: (raw as AskRaw & { viewCount?: number }).viewCount ?? 0,
    isPinned: false,
  }));
}

export async function getMyCollectionComments(
  page: number,
  pageSize: number,
): Promise<SquarePagedData<ProfileCommentItem>> {
  const response = await request.get<
    SquarePagedData<ProfileCommentItem> | ApiEnvelope<SquarePagedData<ProfileCommentItem>>
  >(`${API_PATHS.PROFILE_ME_CONTENTS}/collections/comments`, { params: { page, pageSize } });
  return unwrapResponse(response, '获取收藏评论失败');
}

export async function getMyResonateStories(
  page: number,
  pageSize: number,
): Promise<SquarePagedData<ProfileStoryItem>> {
  const response = await request.get<
    SquarePagedData<StoryRaw> | ApiEnvelope<SquarePagedData<StoryRaw>>
  >(`${API_PATHS.PROFILE_ME_CONTENTS}/resonates/stories`, { params: { page, pageSize } });
  return unwrapPagedItems(unwrapResponse(response, '获取共鸣故事失败'), (raw) =>
    withPinView(normalizeStory(raw), raw),
  );
}

export async function getMyResonateAsks(
  page: number,
  pageSize: number,
): Promise<SquarePagedData<ProfileAskItem>> {
  const response = await request.get<
    SquarePagedData<AskRaw> | ApiEnvelope<SquarePagedData<AskRaw>>
  >(`${API_PATHS.PROFILE_ME_CONTENTS}/resonates/asks`, { params: { page, pageSize } });
  return unwrapPagedItems(unwrapResponse(response, '获取共鸣问答失败'), (raw) => ({
    ...normalizeAsk(raw),
    viewCount: (raw as AskRaw & { viewCount?: number }).viewCount ?? 0,
    isPinned: false,
  }));
}

export async function getMyResonateShares(
  page: number,
  pageSize: number,
): Promise<SquarePagedData<ProfileShareItem>> {
  const response = await request.get<
    SquarePagedData<ShareRaw> | ApiEnvelope<SquarePagedData<ShareRaw>>
  >(`${API_PATHS.PROFILE_ME_CONTENTS}/resonates/shares`, { params: { page, pageSize } });
  return unwrapPagedItems(unwrapResponse(response, '获取共鸣分享失败'), (raw) => ({
    ...normalizeShare(raw),
    viewCount: (raw as ShareRaw & { viewCount?: number }).viewCount ?? 0,
    isPinned: false,
  }));
}

export async function getMyResonateComments(
  page: number,
  pageSize: number,
): Promise<SquarePagedData<ProfileCommentItem>> {
  const response = await request.get<
    SquarePagedData<ProfileCommentItem> | ApiEnvelope<SquarePagedData<ProfileCommentItem>>
  >(`${API_PATHS.PROFILE_ME_CONTENTS}/resonates/comments`, { params: { page, pageSize } });
  return unwrapResponse(response, '获取共鸣评论失败');
}

export async function getUserContents(
  userId: string,
  type: 'stories' | 'shares' | 'asks',
  page: number,
  pageSize: number,
): Promise<SquarePagedData<ProfileStoryItem | ProfileShareItem | ProfileAskItem>> {
  const response = await request.get<
    SquarePagedData<StoryRaw | ShareRaw | AskRaw>
    | ApiEnvelope<SquarePagedData<StoryRaw | ShareRaw | AskRaw>>
  >(`${API_PATHS.PROFILE_USER_HOME}/${userId}/contents/${type}`, {
    params: { page, pageSize },
  });
  const data = unwrapResponse(response, '获取用户内容失败');
  if (type === 'stories') {
    return unwrapPagedItems(data as SquarePagedData<StoryRaw>, (raw) =>
      withPinView(normalizeStory(raw), raw),
    );
  }
  if (type === 'shares') {
    return unwrapPagedItems(data as SquarePagedData<ShareRaw>, (raw) => ({
      ...normalizeShare(raw),
      viewCount: (raw as ShareRaw & { viewCount?: number }).viewCount ?? 0,
      isPinned: false,
    }));
  }
  return unwrapPagedItems(data as SquarePagedData<AskRaw>, (raw) => ({
    ...normalizeAsk(raw),
    viewCount: (raw as AskRaw & { viewCount?: number }).viewCount ?? 0,
    isPinned: false,
  }));
}

export async function getPromotePlans(): Promise<PromotePlan[]> {
  const response = await request.get<
    | PromotePlan[]
    | { items: PromotePlan[] }
    | ApiEnvelope<PromotePlan[] | { items: PromotePlan[] }>
  >(API_PATHS.PROFILE_PROMOTE_PLANS);
  return unwrapItemsList(unwrapResponse(response, '获取推广方案失败'));
}

export async function createPromoteOrder(
  payload: PromoteOrderPayload,
): Promise<PromoteOrderResult> {
  const response = await request.post<
    PromoteOrderResult | ApiEnvelope<PromoteOrderResult>
  >(API_PATHS.PROFILE_PROMOTE_ORDERS, payload);
  return unwrapResponse(response, '提交推广失败');
}

export async function getPrivacySettings(): Promise<PrivacySettings> {
  const response = await request.get<PrivacySettings | ApiEnvelope<PrivacySettings>>(
    API_PATHS.PROFILE_PRIVACY_SETTINGS,
  );
  return unwrapResponse(response, '获取隐私设置失败');
}

export async function putPrivacySettings(payload: PrivacySettings): Promise<void> {
  const response = await request.put<unknown | ApiEnvelope<unknown>>(
    API_PATHS.PROFILE_PRIVACY_SETTINGS,
    payload,
  );
  unwrapVoidResponse(response, '保存隐私设置失败');
}

export async function getNotificationSettings(): Promise<NotificationSettings> {
  const response = await request.get<
    NotificationSettings | ApiEnvelope<NotificationSettings>
  >(API_PATHS.PROFILE_NOTIFICATION_SETTINGS);
  return unwrapResponse(response, '获取通知设置失败');
}

export async function putNotificationSettings(payload: NotificationSettings): Promise<void> {
  const response = await request.put<unknown | ApiEnvelope<unknown>>(
    API_PATHS.PROFILE_NOTIFICATION_SETTINGS,
    payload,
  );
  unwrapVoidResponse(response, '保存通知设置失败');
}

export async function getBlacklist(): Promise<BlacklistItem[]> {
  const response = await request.get<
    BlacklistItem[] | { items: BlacklistItem[] } | ApiEnvelope<BlacklistItem[] | { items: BlacklistItem[] }>
  >(API_PATHS.PROFILE_BLACKLIST);
  return unwrapItemsList(unwrapResponse(response, '获取黑名单失败'));
}

export async function addBlacklist(userId: string): Promise<void> {
  const response = await request.post<unknown | ApiEnvelope<unknown>>(
    API_PATHS.PROFILE_BLACKLIST,
    { userId },
  );
  unwrapVoidResponse(response, '拉黑失败');
}

export async function removeBlacklist(userId: string): Promise<void> {
  const response = await request.delete<unknown | ApiEnvelope<unknown>>(
    `${API_PATHS.PROFILE_BLACKLIST}/${userId}`,
  );
  unwrapVoidResponse(response, '解除拉黑失败');
}

export async function reportUser(payload: {
  userId: string;
  reason: string;
  detail?: string;
}): Promise<void> {
  const response = await request.post<unknown | ApiEnvelope<unknown>>(
    API_PATHS.PROFILE_USER_REPORTS,
    payload,
  );
  unwrapVoidResponse(response, '举报失败');
}

export async function getAccountSecurity(): Promise<AccountSecurityInfo> {
  const response = await request.get<
    AccountSecurityInfo | ApiEnvelope<AccountSecurityInfo>
  >(API_PATHS.PROFILE_ACCOUNT_SECURITY);
  return unwrapResponse(response, '获取账号安全信息失败');
}

export async function getAccountDevices(): Promise<AccountDevice[]> {
  const response = await request.get<
    | AccountDevice[]
    | { items: AccountDevice[] }
    | ApiEnvelope<AccountDevice[] | { items: AccountDevice[] }>
  >(API_PATHS.PROFILE_ACCOUNT_DEVICES);
  return unwrapItemsList(unwrapResponse(response, '获取登录设备失败'));
}

export async function deleteAccountDevice(deviceId: string): Promise<void> {
  const response = await request.delete<unknown | ApiEnvelope<unknown>>(
    `${API_PATHS.PROFILE_ACCOUNT_DEVICES}/${deviceId}`,
  );
  unwrapVoidResponse(response, '下线设备失败');
}

export async function deleteAccount(): Promise<void> {
  const response = await request.post<unknown | ApiEnvelope<unknown>>(
    API_PATHS.PROFILE_ACCOUNT_DELETE,
  );
  unwrapVoidResponse(response, '注销账号失败');
}

export async function getHelpFaqs(): Promise<HelpFaq[]> {
  const response = await request.get<
    HelpFaq[] | { items: HelpFaq[] } | ApiEnvelope<HelpFaq[] | { items: HelpFaq[] }>
  >(API_PATHS.PROFILE_HELP_FAQS);
  return unwrapItemsList(unwrapResponse(response, '获取常见问题失败'));
}

export async function submitHelpFeedback(payload: HelpFeedbackPayload): Promise<void> {
  const response = await request.post<unknown | ApiEnvelope<unknown>>(
    API_PATHS.PROFILE_HELP_FEEDBACK,
    payload,
  );
  unwrapVoidResponse(response, '提交反馈失败');
}

export async function getHelpTickets(): Promise<HelpTicket[]> {
  const response = await request.get<
    HelpTicket[] | { items: HelpTicket[] } | ApiEnvelope<HelpTicket[] | { items: HelpTicket[] }>
  >(API_PATHS.PROFILE_HELP_TICKETS);
  return unwrapItemsList(unwrapResponse(response, '获取反馈记录失败'));
}

export async function getNotifications(
  page: number,
  pageSize: number,
  category?: string,
): Promise<SquarePagedData<ProfileNotificationItem>> {
  const response = await request.get<
    | SquarePagedData<ProfileNotificationItem>
    | ApiEnvelope<SquarePagedData<ProfileNotificationItem>>
  >(API_PATHS.PROFILE_NOTIFICATIONS, {
    params: { page, pageSize, category },
  });
  return unwrapResponse(response, '获取消息失败');
}

export async function markNotificationsRead(payload: {
  ids?: string[];
  all?: boolean;
}): Promise<void> {
  const response = await request.post<unknown | ApiEnvelope<unknown>>(
    API_PATHS.PROFILE_NOTIFICATIONS_READ,
    payload,
  );
  unwrapVoidResponse(response, '标记已读失败');
}

export async function getUnreadNotificationCount(): Promise<number> {
  const response = await request.get<{ count: number } | ApiEnvelope<{ count: number }>>(
    API_PATHS.PROFILE_NOTIFICATIONS_UNREAD,
  );
  return unwrapResponse(response, '获取未读数失败').count ?? 0;
}

export async function getMembership(): Promise<MembershipInfo> {
  const response = await request.get<
    MembershipInfo | null | ApiEnvelope<MembershipInfo | null>
  >(API_PATHS.PROFILE_MEMBERSHIP);
  const data = unwrapResponse(response, '获取会员信息失败');
  if (!data) {
    return { isMember: false, level: null, expireAt: null, benefits: [] };
  }
  return {
    isMember: data.isMember ?? Boolean(data.level),
    level: data.level ?? null,
    expireAt: data.expireAt ?? null,
    benefits: data.benefits ?? [],
  };
}

export { toEntityId };
