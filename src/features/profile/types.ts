import type { UserGender } from '@/src/features/auth/types';
import type { ProfileCity } from '@/src/features/profile/regionTypes';
import type { FollowRelation } from '@/src/features/follow/types';
import type { ProfileContentTabId } from '@/src/features/profile/constants';
import type { Ask, Share, Story } from '@/src/features/square/types';
import type { ContentAnchor } from '@/src/features/square/utils/contentAnchor';

export type { FollowRelation };

export interface ProfileAuthor {
  id: string;
  nickName: string;
  avatarUrl: string;
  level?: string | number | null;
  identityTags?: string[];
}

export interface ProfileStats {
  followingCount: number;
  followerCount: number;
  resonateReceivedCount: number;
  flowerReceivedCount: number;
  flowerSentCount: number;
}

export interface ProfileDetail {
  id: string;
  nickName: string;
  avatarUrl: string;
  level: string | number | null;
  identityTags: string[];
  bio: string;
  gender: UserGender;
  birthday: string;
  region: string | null;
  cityCode: string | null;
  city: ProfileCity | null;
  relationshipStatus: string | null;
  ipLocation: string | null;
}

export interface RecentReceivedFlower {
  id: string;
  giftFlowerId: string;
  giftFlowerName: string;
  giftFlowerImagePath: string;
  quantity: number;
  sender: ProfileAuthor;
  createdAt: string;
}

export interface ProfileHomeData {
  profile: ProfileDetail;
  stats: ProfileStats;
  recentReceivedFlowers: RecentReceivedFlower[];
  flowerCoin: number;
}

export interface UserHomeData extends ProfileHomeData {
  relation: FollowRelation;
  isBlockedByMe: boolean;
  isBlockedMe: boolean;
}

export interface UpdateProfilePayload {
  nickName: string;
  gender: UserGender;
  birthday: string;
  bio?: string;
  avatarPath?: string;
  region?: string | null;
  /** 最后一级行政区划代码；`null` 清空 cityCode 与 region */
  cityCode?: string | null;
  relationshipStatus?: string | null;
}

export interface ResonateReceivedItem {
  id: string;
  createdAt: string;
  fromUser: ProfileAuthor;
  content: {
    targetType: string;
    targetId: string;
    titleOrSummary: string;
    thumbnailPath: string | null;
    rootTargetType?: string;
    rootTargetId?: string;
  };
}

export interface GiftFlowerReceivedItem {
  id: string;
  giftFlowerId: string;
  name: string;
  imagePath: string;
  quantity: number;
  sender: ProfileAuthor;
  createdAt: string;
}

export interface FlowerReceivedLedgerItem {
  id: string;
  sender: ProfileAuthor;
  giftFlower: { id: string; name: string; imagePath: string };
  quantity: number;
  message: string | null;
  createdAt: string;
  relatedContent: ContentAnchor | null;
}

export interface FlowerSentItem {
  id: string;
  giftFlower: { id: string; name: string; imagePath: string };
  quantity: number;
  createdAt: string;
  receiver: ProfileAuthor;
  message: string | null;
  relatedContent: ContentAnchor | null;
}

export interface ProfileCommentItem {
  id: string;
  content: string;
  createdAt: string;
  source: ContentAnchor;
}

export type ProfileStoryItem = Story & { viewCount: number; isPinned: boolean };
export type ProfileShareItem = Share & { viewCount: number; isPinned: boolean };
export type ProfileAskItem = Ask & { viewCount: number; isPinned: boolean };

export interface PromotePlan {
  id: string;
  name: string;
  durationHours: number;
  expectedExtraViews: number;
  flowerCoinCost: number;
}

export interface PromoteOrderPayload {
  targetType: 'story' | 'share' | 'ask';
  targetId: string;
  planId: string;
}

export interface PromoteOrderResult {
  orderId: string;
  flowerCoinCost: number;
  flowerCoinBalance: number;
}

export interface PrivacySettings {
  profileVisibility: 'public' | 'followers' | 'private';
  feedVisibility: 'public' | 'followers' | 'private';
  messagePermission: 'everyone' | 'followers' | 'off';
  showOnlineStatus: boolean;
  personalizedRecommend: boolean;
  personalizedService: boolean;
}

export interface NotificationSettings {
  system: boolean;
  interaction: boolean;
  directMessage: boolean;
  groupChat: boolean;
  quietHoursEnabled: boolean;
  quietHoursStart: string | null;
  quietHoursEnd: string | null;
  ringtoneId: string | null;
  previewMode: 'full' | 'generic' | 'hidden';
}

export interface BlacklistItem {
  userId: string;
  nickName: string;
  avatarUrl: string;
  createdAt: string;
}

export interface AccountSecurityInfo {
  phoneMasked: string | null;
  emailMasked: string | null;
  hasPassword: boolean;
  thirdPartyBindings: string[];
  riskTips: string[];
}

export interface AccountDevice {
  id: string;
  name: string;
  lastActiveAt: string;
  isCurrent: boolean;
}

export interface HelpFaq {
  id: string;
  question: string;
  answer: string;
}

export interface HelpFeedbackPayload {
  type: 'feedback' | 'suggestion';
  content: string;
  contact?: string;
}

export interface HelpTicket {
  id: string;
  type: string;
  content: string;
  status: string;
  createdAt: string;
}

export interface ProfileNotificationItem {
  id: string;
  category: 'system' | 'interaction' | 'message';
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string;
  link?: { type: string; id: string };
}

export interface MembershipInfo {
  isMember: boolean;
  level: string | null;
  expireAt: string | null;
  benefits: string[];
}

export interface ProfileContentTabState {
  main: ProfileContentTabId;
  publishSub: 'story' | 'share' | 'ask';
  collectSub: 'story' | 'ask' | 'comment';
  resonateSub: 'story' | 'ask' | 'share' | 'comment';
}

export interface ProfilePageParams {
  page: number;
  pageSize: number;
}
