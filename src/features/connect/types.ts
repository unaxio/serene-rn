export type ConnectNotificationCategory =
  | 'flowers'
  | 'resonate-collect'
  | 'follow-visit'
  | 'mention-invite'
  | 'comment-reply'
  | 'system';

export type ConnectLinkType =
  | 'story'
  | 'share'
  | 'ask'
  | 'ask_answer'
  | 'comment'
  | 'user'
  | 'system'
  | 'topic'
  | 'dm';

export type ConnectFollowRelation = 'none' | 'following' | 'followed_by' | 'mutual';

export interface ConnectPaged<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ConnectUnreadCounts {
  total: number;
  flowers: number;
  resonateCollect: number;
  followVisit: number;
  mentionInvite: number;
  commentReply: number;
  system: number;
  dm: number;
}

export interface ConnectConversation {
  id: string;
  kind: 'system' | 'dm';
  title: string;
  avatarUrl: string | null;
  summary: string;
  lastMessageAt: string | null;
  unreadCount: number;
  pinned: boolean;
  muted: boolean;
  peerUserId: string | null;
}

export interface ConnectHomeData {
  unread: ConnectUnreadCounts;
  conversations: ConnectPaged<ConnectConversation>;
}

export interface ConnectLink {
  type: ConnectLinkType;
  id: string;
  rootType?: string;
  rootId?: string;
  highlightId?: string;
  /** 回复时的一级评论 id，用于展开回复并定位 */
  threadRootId?: string;
}

export interface ConnectNotificationExtra {
  giftFlowerName?: string;
  giftFlowerImagePath?: string;
  quantity?: number;
  message?: string;
  actionId?: string;
  action?: 'resonate' | 'collect';
  event?: 'follow' | 'visit' | 'mention' | 'invite' | 'comment' | 'answer' | 'reply';
  relation?: ConnectFollowRelation;
  replyToId?: string;
  hasDetail?: boolean;
}

export interface ConnectActor {
  id: string;
  nickName: string;
  avatarUrl: string;
}

export interface ConnectNotification {
  id: string;
  category: ConnectNotificationCategory;
  isRead: boolean;
  createdAt: string;
  actor: ConnectActor | null;
  title: string;
  body: string;
  summary: string | null;
  actionLabel: string | null;
  link: ConnectLink | null;
  extra?: ConnectNotificationExtra;
}

export interface ConnectReadResult {
  isRead: boolean;
  unreadDelta: number;
}

export interface ConnectClearResult {
  cleared: number;
}

export interface SystemMessageDetail {
  id: string;
  title: string;
  body: string;
  images: string[];
  createdAt: string;
  withdrawn: boolean;
  action: { label: string; link: ConnectLink | null } | null;
  unreadDelta?: number;
}

export interface SystemMuteSettings {
  muted: boolean;
}

export interface AiRole {
  id: string;
  name: string;
  avatarUrl: string;
  typeLabel: string;
  intro: string;
  onlineCount: number;
}

export interface AiRoleList {
  items: AiRole[];
  lastRoleId: string | null;
}

export interface AiChatOpening {
  id: string;
  role: 'assistant';
  content: string;
  createdAt: string;
}

export interface AiChatSeedMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}

export interface AiChatSession {
  sessionId: string;
  role: { id: string; name: string; avatarUrl: string };
  opening?: AiChatOpening;
  messages?: AiChatSeedMessage[];
}

export interface AiStreamRequest {
  sessionId: string;
  content: string;
  retryAssistantId?: string;
}

export interface DmPeer {
  id: string;
  nickName: string;
  avatarUrl: string;
}

export interface DmConversationMeta {
  id: string;
  peer: DmPeer;
  muted: boolean;
  pinned: boolean;
  blockedByMe: boolean;
  blockedMe: boolean;
  inputHint?: string | null;
}

export interface DmQuote {
  id: string;
  senderName: string;
  summary: string;
  missing: boolean;
}

export interface DmPayload {
  text?: string;
}

export interface DmMessage {
  id: string;
  senderId: string;
  messageType: string;
  payload: DmPayload;
  quote: DmQuote | null;
  createdAt: string;
  status: 'sent' | 'failed';
}

export interface DmMessagePage {
  conversation: DmConversationMeta;
  items: DmMessage[];
  total: number;
  page: number;
  pageSize: number;
}

export interface SendDmMessagePayload {
  messageType: 'text';
  payload: { text: string };
  quoteMessageId?: string;
}

export interface DmSearchHit {
  id: string;
  senderName: string;
  avatarUrl: string;
  createdAt: string;
  snippet: string;
}

export interface AiChatBubble {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  pending?: boolean;
  failed?: boolean;
  retryContent?: string;
}
