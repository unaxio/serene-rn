import type { GiftFlowerLedger, SquareAuthor } from '@/src/features/square/types';

export function uniqueLedgerSenders(items: GiftFlowerLedger[]): SquareAuthor[] {
  const seen = new Set<string>();
  const senders: SquareAuthor[] = [];
  for (const item of items) {
    const senderId = item.sender.id;
    if (!senderId || seen.has(senderId)) {
      continue;
    }
    seen.add(senderId);
    senders.push(item.sender);
  }
  return senders;
}
