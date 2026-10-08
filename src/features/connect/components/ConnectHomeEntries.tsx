import { Pressable, StyleSheet, Text, View } from "react-native";

import { APP_TEXT_COLOR } from "@/constants/Colors";
import { ConnectBadge } from "@/src/features/connect/components/ConnectBadge";
import { CONNECT_INTERACTION_ENTRIES } from "@/src/features/connect/constants";
import type {
  ConnectNotificationCategory,
  ConnectUnreadCounts,
} from "@/src/features/connect/types";
import {
  MUTED_TEXT_COLOR,
  SQUARE_PAGE_BG,
} from "@/src/features/square/constants";

interface ConnectHomeEntriesProps {
  unread?: ConnectUnreadCounts;
  onOpenCategory: (category: ConnectNotificationCategory) => void;
  onOpenAi: () => void;
}

const CARD_BG = "#FFFFFF";

export function ConnectHomeEntries({
  unread,
  onOpenCategory,
  onOpenAi,
}: ConnectHomeEntriesProps) {
  return (
    <View style={styles.wrap}>
      <View style={styles.dual}>
        <Pressable style={styles.entry} onPress={onOpenAi}>
          <Text style={styles.entryTitle}>AI 陪我聊</Text>
          <Text style={styles.entryHint}>选一个角色开始</Text>
        </Pressable>
        {/* <Pressable style={styles.entry} onPress={() => showToast('功能开发中')}>
          <Text style={styles.entryTitle}>AI 众议厅</Text>
          <Text style={styles.entryHint}>即将开放</Text>
        </Pressable> */}
      </View>
      {CONNECT_INTERACTION_ENTRIES.map((entry) => (
        <Pressable
          key={entry.category}
          style={styles.row}
          onPress={() => onOpenCategory(entry.category)}
        >
          <Text style={styles.rowLabel}>{entry.label}</Text>
          <ConnectBadge count={unread?.[entry.unreadKey] ?? 0} />
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: SQUARE_PAGE_BG,
    paddingBottom: 8,
  },
  dual: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  entry: {
    flex: 1,
    backgroundColor: CARD_BG,
    borderRadius: 12,
    padding: 14,
    gap: 4,
  },
  entryTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: APP_TEXT_COLOR,
  },
  entryHint: {
    fontSize: 12,
    color: MUTED_TEXT_COLOR,
  },
  row: {
    marginHorizontal: 16,
    marginBottom: 8,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: CARD_BG,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rowLabel: {
    fontSize: 15,
    color: APP_TEXT_COLOR,
    fontWeight: "600",
  },
});
