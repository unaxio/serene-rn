/**
 * 送花目标扩展：内容送花已有；用户送花 / 回赠待后端支持。
 * 调用方在接口就绪后传入 targetType: 'user' | 'user_action'。
 */
export type FlowerSendTargetType =
  | 'story'
  | 'share'
  | 'ask_answer'
  | 'comment'
  | 'user'
  | 'user_action';

export interface FlowerSendTarget {
  targetType: FlowerSendTargetType;
  targetId: string;
  /** 赠言，主要用于 user / user_action */
  message?: string;
}
