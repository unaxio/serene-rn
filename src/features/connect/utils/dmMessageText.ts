import type { DmMessage } from '@/src/features/connect/types';

export const DM_TEXT_MESSAGE_TYPE = 'text';

export const DM_UNSUPPORTED_MESSAGE = '暂不支持的消息类型';

export function dmMessageText(message: DmMessage): string {
  if (message.messageType !== DM_TEXT_MESSAGE_TYPE) {
    return DM_UNSUPPORTED_MESSAGE;
  }
  return message.payload.text?.trim() ?? '';
}
