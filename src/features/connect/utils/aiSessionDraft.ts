import type { AiChatSession } from '@/src/features/connect/types';

let rememberedRoleId: string | null = null;
let sessionDraft: AiChatSession | null = null;

export function rememberAiRole(roleId: string): void {
  rememberedRoleId = roleId;
}

export function readRememberedAiRole(): string | null {
  return rememberedRoleId;
}

export function setAiSessionDraft(session: AiChatSession): void {
  sessionDraft = session;
}

export function readAiSessionDraft(sessionId: string): AiChatSession | null {
  if (sessionDraft?.sessionId !== sessionId) {
    return null;
  }
  return sessionDraft;
}

export function clearAiSessionDraft(): void {
  sessionDraft = null;
}
