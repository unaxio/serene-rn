import { unwrapResponse, type ApiEnvelope } from '@/src/features/square/api';
import type {
  GiftFlowerLedger,
  GiftFlowerLedgerTargetType,
  GiftFlowerSnapshot,
  GetGiftFlowerLedgersParams,
  SquareAuthor,
  SquarePagedData,
} from '@/src/features/square/types';
import { normalizeAuthor, toEntityId, unwrapPagedItems } from '@/src/features/square/utils/normalize';
import { API_PATHS } from '@/src/services/config';
import { request } from '@/src/services/request';

interface GiftFlowerSnapshotRaw {
  id?: string;
  _id?: string;
  name?: string;
  tag?: string;
  imagePath?: string;
}

interface GiftFlowerLedgerRaw {
  id?: string;
  _id?: string;
  targetType?: string;
  targetId?: string;
  quantity?: number;
  createdAt?: string;
  sender?: SquareAuthor | null;
  receiver?: SquareAuthor | null;
  giftFlower?: GiftFlowerSnapshotRaw;
}

const LEDGER_TARGET_TYPES: GiftFlowerLedgerTargetType[] = [
  'story',
  'share',
  'ask_answer',
  'comment',
];

function isLedgerTargetType(value: string): value is GiftFlowerLedgerTargetType {
  return LEDGER_TARGET_TYPES.some((item) => item === value);
}

function normalizeSnapshot(raw: GiftFlowerSnapshotRaw | undefined): GiftFlowerSnapshot {
  return {
    id: toEntityId(raw),
    name: raw?.name ?? '',
    tag: raw?.tag ?? '',
    imagePath: raw?.imagePath ?? '',
  };
}

function normalizeLedger(raw: GiftFlowerLedgerRaw): GiftFlowerLedger {
  const targetType = raw.targetType ?? '';
  return {
    id: toEntityId(raw),
    targetType: isLedgerTargetType(targetType) ? targetType : 'story',
    targetId: raw.targetId ?? '',
    quantity: raw.quantity ?? 0,
    createdAt: raw.createdAt ?? '',
    sender: normalizeAuthor(raw.sender),
    receiver: normalizeAuthor(raw.receiver),
    giftFlower: normalizeSnapshot(raw.giftFlower),
  };
}

export async function getGiftFlowerLedgers(
  params: GetGiftFlowerLedgersParams,
): Promise<SquarePagedData<GiftFlowerLedger>> {
  const response = await request.get<
    SquarePagedData<GiftFlowerLedgerRaw> | ApiEnvelope<SquarePagedData<GiftFlowerLedgerRaw>>
  >(API_PATHS.GIFT_FLOWER_LEDGERS, {
    params: {
      targetType: params.targetType,
      targetId: params.targetId,
      page: params.page,
      pageSize: params.pageSize,
    },
  });
  return unwrapPagedItems(unwrapResponse(response, '获取送花记录失败'), normalizeLedger);
}
