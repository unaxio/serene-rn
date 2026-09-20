import { unwrapResponse, unwrapVoidResponse, type ApiEnvelope } from '@/src/features/square/api';
import { API_PATHS } from '@/src/services/config';
import { request } from '@/src/services/request';

import type {
  AiChatSession,
  AiRoleList,
  ConnectClearResult,
  ConnectHomeData,
  ConnectNotification,
  ConnectNotificationCategory,
  ConnectPaged,
  ConnectReadResult,
  DmMessage,
  DmMessagePage,
  DmSearchHit,
  SendDmMessagePayload,
  SystemMessageDetail,
  SystemMuteSettings,
} from './types';

export async function getConnectHome(page: number, pageSize: number): Promise<ConnectHomeData> {
  const response = await request.get<ConnectHomeData | ApiEnvelope<ConnectHomeData>>(
    API_PATHS.CONNECT_HOME,
    { params: { page, pageSize } },
  );
  return unwrapResponse(response, '获取连接首页失败');
}

export async function getConnectUnread(): Promise<{ total: number }> {
  const response = await request.get<{ total: number } | ApiEnvelope<{ total: number }>>(
    API_PATHS.CONNECT_UNREAD,
  );
  return unwrapResponse(response, '获取未读数失败');
}

export async function pinConnectConversation(id: string, pinned: boolean): Promise<void> {
  const response = await request.post<unknown | ApiEnvelope<unknown>>(
    `${API_PATHS.CONNECT_CONVERSATIONS}/${id}/pin`,
    { pinned },
  );
  unwrapVoidResponse(response, '设置失败，请重试');
}

export async function deleteConnectConversation(id: string): Promise<void> {
  const response = await request.delete<unknown | ApiEnvelope<unknown>>(
    `${API_PATHS.CONNECT_CONVERSATIONS}/${id}`,
  );
  unwrapVoidResponse(response, '删除失败，请重试');
}

export async function getConnectNotifications(
  category: ConnectNotificationCategory,
  page: number,
  pageSize: number,
): Promise<ConnectPaged<ConnectNotification>> {
  const response = await request.get<
    ConnectPaged<ConnectNotification> | ApiEnvelope<ConnectPaged<ConnectNotification>>
  >(`${API_PATHS.CONNECT_NOTIFICATIONS}/${category}`, { params: { page, pageSize } });
  return unwrapResponse(response, '获取消息失败');
}

export async function markConnectNotificationRead(id: string): Promise<ConnectReadResult> {
  const response = await request.post<ConnectReadResult | ApiEnvelope<ConnectReadResult>>(
    `${API_PATHS.CONNECT_NOTIFICATIONS}/${id}/read`,
    {},
  );
  return unwrapResponse(response, '标记已读失败');
}

export async function clearConnectNotifications(
  category: ConnectNotificationCategory,
  before: string,
): Promise<ConnectClearResult> {
  const response = await request.post<ConnectClearResult | ApiEnvelope<ConnectClearResult>>(
    `${API_PATHS.CONNECT_NOTIFICATIONS}/clear`,
    { category, before },
  );
  return unwrapResponse(response, '清除未读失败');
}

export async function getSystemMessage(id: string): Promise<SystemMessageDetail> {
  const response = await request.get<SystemMessageDetail | ApiEnvelope<SystemMessageDetail>>(
    `${API_PATHS.CONNECT_SYSTEM_MESSAGES}/${id}`,
  );
  return unwrapResponse(response, '获取系统消息失败');
}

export async function getSystemMute(): Promise<SystemMuteSettings> {
  const response = await request.get<SystemMuteSettings | ApiEnvelope<SystemMuteSettings>>(
    `${API_PATHS.CONNECT_SYSTEM_MESSAGES}/settings`,
  );
  return unwrapResponse(response, '获取免打扰设置失败');
}

export async function updateSystemMute(muted: boolean): Promise<SystemMuteSettings> {
  const response = await request.put<SystemMuteSettings | ApiEnvelope<SystemMuteSettings>>(
    `${API_PATHS.CONNECT_SYSTEM_MESSAGES}/settings`,
    { muted },
  );
  return unwrapResponse(response, '设置失败，请重试');
}

export async function getAiRoles(): Promise<AiRoleList> {
  const response = await request.get<AiRoleList | ApiEnvelope<AiRoleList>>(API_PATHS.CONNECT_AI_ROLES);
  return unwrapResponse(response, '获取角色失败');
}

export async function createAiSession(roleId: string): Promise<AiChatSession> {
  const response = await request.post<AiChatSession | ApiEnvelope<AiChatSession>>(
    API_PATHS.CONNECT_AI_SESSIONS,
    { roleId },
  );
  return unwrapResponse(response, '创建对话失败');
}

export async function endAiSession(sessionId: string): Promise<void> {
  const response = await request.post<unknown | ApiEnvelope<unknown>>(
    `${API_PATHS.CONNECT_AI_SESSIONS}/${sessionId}/end`,
    {},
  );
  unwrapVoidResponse(response, '结束对话失败');
}

export async function getDmMessages(
  conversationId: string,
  page: number,
  pageSize: number,
): Promise<DmMessagePage> {
  const response = await request.get<DmMessagePage | ApiEnvelope<DmMessagePage>>(
    `${API_PATHS.CONNECT_DM}/${conversationId}/messages`,
    { params: { page, pageSize } },
  );
  return unwrapResponse(response, '获取私信失败');
}

export async function sendDmMessage(
  conversationId: string,
  payload: SendDmMessagePayload,
): Promise<DmMessage> {
  const response = await request.post<DmMessage | ApiEnvelope<DmMessage>>(
    `${API_PATHS.CONNECT_DM}/${conversationId}/messages`,
    payload,
  );
  return unwrapResponse(response, '发送失败');
}

export async function updateDmSettings(
  conversationId: string,
  payload: { muted?: boolean; pinned?: boolean },
): Promise<void> {
  const response = await request.put<unknown | ApiEnvelope<unknown>>(
    `${API_PATHS.CONNECT_DM}/${conversationId}/settings`,
    payload,
  );
  unwrapVoidResponse(response, '设置失败，请重试');
}

export async function clearDmMessages(conversationId: string): Promise<void> {
  const response = await request.post<unknown | ApiEnvelope<unknown>>(
    `${API_PATHS.CONNECT_DM}/${conversationId}/clear`,
    {},
  );
  unwrapVoidResponse(response, '清空失败，请重试');
}

export async function hideDmMessage(conversationId: string, messageId: string): Promise<void> {
  const response = await request.delete<unknown | ApiEnvelope<unknown>>(
    `${API_PATHS.CONNECT_DM}/${conversationId}/messages/${messageId}`,
  );
  unwrapVoidResponse(response, '删除失败，请重试');
}

export async function searchDmMessages(
  conversationId: string,
  keyword: string,
  page: number,
  pageSize: number,
): Promise<ConnectPaged<DmSearchHit>> {
  const response = await request.get<
    ConnectPaged<DmSearchHit> | ApiEnvelope<ConnectPaged<DmSearchHit>>
  >(`${API_PATHS.CONNECT_DM}/${conversationId}/search`, {
    params: { keyword, page, pageSize },
  });
  return unwrapResponse(response, '搜索失败');
}
