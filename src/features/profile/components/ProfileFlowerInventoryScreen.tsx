import { FlashList } from "@shopify/flash-list";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { APP_TEXT_COLOR } from "@/constants/Colors";
import { getGiftFlowersReceived } from "@/src/features/profile/api";
import {
  FlowerInventoryReceivedRow,
  FlowerInventorySendableRow,
} from "@/src/features/profile/components/FlowerInventoryRows";
import { ProfileSubTabs } from "@/src/features/profile/components/ProfileSubTabs";
import {
  FLOWER_INVENTORY_FILTERS,
  PROFILE_ACCENT,
  PROFILE_MUTED,
  PROFILE_PAGE_BG,
  PROFILE_QUERY_KEYS,
  type FlowerInventoryFilterId
} from "@/src/features/profile/constants";
import { useProfileInfiniteQuery } from "@/src/features/profile/hooks/useProfileInfiniteQuery";
import type { GiftFlowerReceivedItem } from "@/src/features/profile/types";
import { SquarePageHeader } from "@/src/features/square/components/SquarePageHeader";
import {
  COMING_SOON_MESSAGE,
  SQUARE_QUERY_KEYS,
} from "@/src/features/square/constants";
import { getGiftFlowerInventory } from "@/src/features/square/giftFlowerApi";
import type { GiftFlowerInventoryItem } from "@/src/features/square/types";
import { showToast } from "@/src/utils/toast";

type InventoryRow =
  | { key: string; kind: "sendable"; item: GiftFlowerInventoryItem }
  | { key: string; kind: "received"; item: GiftFlowerReceivedItem };

export function ProfileFlowerInventoryScreen() {
  const router = useRouter();
  const [filter, setFilter] = useState<FlowerInventoryFilterId>("sendable");
  const inventoryQuery = useQuery({
    queryKey: SQUARE_QUERY_KEYS.giftFlowerInventory,
    queryFn: getGiftFlowerInventory,
  });
  const receivedList = useProfileInfiniteQuery(
    PROFILE_QUERY_KEYS.giftFlowersReceived,
    getGiftFlowersReceived,
    filter === "received",
  );

  const rows = useMemo((): InventoryRow[] => {
    if (filter === "received") {
      return receivedList.items.map((item) => ({
        key: item.id,
        kind: "received" as const,
        item,
      }));
    }
    return (inventoryQuery.data?.items ?? [])
      .filter((item) => item.purchasedCount > 0)
      .map((item) => ({
        key: item.giftFlowerId,
        kind: "sendable" as const,
        item,
      }));
  }, [filter, inventoryQuery.data?.items, receivedList.items]);

  const isLoading =
    filter === "received" ? receivedList.isLoading : inventoryQuery.isLoading;

  const renderItem = useCallback(({ item: row }: { item: InventoryRow }) => {
    if (row.kind === "received") {
      return <FlowerInventoryReceivedRow item={row.item} />;
    }
    return (
      <FlowerInventorySendableRow
        item={row.item}
        onSend={() => showToast(COMING_SOON_MESSAGE)}
      />
    );
  }, []);

  return (
    <SafeAreaView style={styles.safe} edges={[]}>
      <SquarePageHeader title="花库" onBack={() => router.back()} />
      <View style={styles.balance}>
        <Text style={styles.balanceLabel}>花瓣余额</Text>
        <Text style={styles.balanceValue}>
          {inventoryQuery.data?.flowerCoin ?? 0}
        </Text>
        {/* <Text style={styles.hint}>{PROFILE_GET_PETAL_HINT}</Text> */}
      </View>
      <ProfileSubTabs
        options={FLOWER_INVENTORY_FILTERS}
        value={filter}
        onChange={setFilter}
      />
      {isLoading ? (
        <ActivityIndicator style={styles.loading} color={PROFILE_ACCENT} />
      ) : (
        <FlashList
          data={rows}
          keyExtractor={(item) => item.key}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          onEndReached={
            filter === "received" ? receivedList.loadMore : undefined
          }
          ListEmptyComponent={
            <Text style={styles.empty}>
              {filter === "received" ? "暂无获赠花" : "暂无可送的花"}
            </Text>
          }
          ListFooterComponent={
            filter === "received" && receivedList.isFetchingMore ? (
              <ActivityIndicator
                style={styles.loading}
                color={PROFILE_ACCENT}
              />
            ) : null
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: PROFILE_PAGE_BG },
  balance: {
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    gap: 4,
  },
  balanceLabel: { fontSize: 13, color: PROFILE_MUTED },
  balanceValue: { fontSize: 28, fontWeight: "700", color: APP_TEXT_COLOR },
  hint: { fontSize: 12, color: PROFILE_MUTED, marginTop: 4 },
  loading: { marginTop: 40 },
  list: { paddingHorizontal: 16, paddingBottom: 24 },
  empty: {
    textAlign: "center",
    color: PROFILE_MUTED,
    marginTop: 40,
    fontSize: 14,
  },
});
