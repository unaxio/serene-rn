import { API_PATHS } from '@/src/services/config';
import { request } from '@/src/services/request';

import { unwrapResponse, type ApiEnvelope } from '@/src/features/square/api';
import type {
  GiftFlower,
  GiftFlowerInventory,
  GiftFlowerInventoryItem,
  PurchaseGiftFlowerPayload,
  PurchaseGiftFlowerResponse,
} from '@/src/features/square/types';
import { toEntityId } from '@/src/features/square/utils/normalize';

interface GiftFlowerRaw {
  id?: string;
  _id?: string;
  name?: string;
  tag?: string;
  imagePath?: string;
  coinValue?: number;
  status?: number;
  sortOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}

interface GiftFlowerInventoryItemRaw {
  giftFlowerId?: string;
  name?: string;
  tag?: string;
  imagePath?: string;
  coinValue?: number;
  purchasedCount?: number;
  receivedCount?: number;
}

interface GiftFlowerInventoryRaw {
  flowerCoin?: number;
  items?: GiftFlowerInventoryItemRaw[];
}

function normalizeGiftFlower(raw: GiftFlowerRaw): GiftFlower {
  return {
    id: toEntityId(raw),
    name: raw.name ?? '',
    tag: raw.tag ?? '',
    imagePath: raw.imagePath ?? '',
    coinValue: raw.coinValue ?? 0,
    status: raw.status ?? 0,
    sortOrder: raw.sortOrder ?? 0,
    createdAt: raw.createdAt ?? '',
    updatedAt: raw.updatedAt ?? '',
  };
}

function normalizeInventoryItem(raw: GiftFlowerInventoryItemRaw): GiftFlowerInventoryItem {
  return {
    giftFlowerId: raw.giftFlowerId ?? '',
    name: raw.name ?? '',
    tag: raw.tag ?? '',
    imagePath: raw.imagePath ?? '',
    coinValue: raw.coinValue ?? 0,
    purchasedCount: raw.purchasedCount ?? 0,
    receivedCount: raw.receivedCount ?? 0,
  };
}

export async function getGiftFlowerCatalog(): Promise<GiftFlower[]> {
  const response = await request.get<GiftFlowerRaw[] | ApiEnvelope<GiftFlowerRaw[]>>(
    API_PATHS.GIFT_FLOWERS,
  );
  const items = unwrapResponse(response, '获取礼物花目录失败');
  return (items ?? [])
    .map(normalizeGiftFlower)
    .sort((left, right) => left.sortOrder - right.sortOrder);
}

export async function getGiftFlowerInventory(): Promise<GiftFlowerInventory> {
  const response = await request.get<
    GiftFlowerInventoryRaw | ApiEnvelope<GiftFlowerInventoryRaw>
  >(API_PATHS.GIFT_FLOWER_INVENTORY);
  const data = unwrapResponse(response, '获取花库失败');
  return {
    flowerCoin: data.flowerCoin ?? 0,
    items: (data.items ?? []).map(normalizeInventoryItem),
  };
}

export async function purchaseGiftFlower(
  payload: PurchaseGiftFlowerPayload,
): Promise<PurchaseGiftFlowerResponse> {
  const response = await request.post<
    PurchaseGiftFlowerResponse | ApiEnvelope<PurchaseGiftFlowerResponse>
  >(API_PATHS.GIFT_FLOWER_PURCHASE, payload);
  const data = unwrapResponse(response, '购买礼物花失败');
  return {
    giftFlowerId: data.giftFlowerId ?? payload.giftFlowerId,
    purchasedCount: data.purchasedCount ?? 0,
    receivedCount: data.receivedCount ?? 0,
    flowerCoin: data.flowerCoin ?? 0,
  };
}
