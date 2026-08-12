import { memo } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

import { APP_TEXT_COLOR } from "@/src/features/soulFlower/constants";
import type { PartnerStatusResponse } from "@/src/features/soulFlower/types";

interface StreakDetailModalProps {
  visible: boolean;
  onClose: () => void;
  partnerStatus?: PartnerStatusResponse;
}

function StreakDetailModalComponent({
  visible,
  onClose,
  partnerStatus,
}: StreakDetailModalProps) {
  const myStreak = partnerStatus?.myStreakCount ?? 0;
  const partnerStreak = partnerStatus?.partnerStreakCount ?? 0;
  const myDone = partnerStatus?.myTodayAnswered === true;
  const partnerDone = partnerStatus?.partnerInfo?.todayAnswered === true;

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <Text style={styles.title}>打卡详情</Text>
          <Text style={styles.row}>我的连续觉察：{myStreak} 天</Text>
          <Text style={styles.row}>
            今日觉察：{myDone ? "已完成" : "未完成"}
          </Text>
          {partnerStatus?.hasPartner ? (
            <>
              <Text style={styles.row}>双人联盟：{partnerStreak} 天</Text>
              <Text style={styles.row}>
                伙伴今日：{partnerDone ? "已完成" : "未完成"}
              </Text>
            </>
          ) : (
            <Text style={styles.row}>尚未绑定伙伴</Text>
          )}
          <Pressable style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>知道了</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

export const StreakDetailModal = memo(StreakDetailModalComponent);

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(15,23,42,0.45)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  sheet: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    gap: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: APP_TEXT_COLOR,
    marginBottom: 4,
  },
  row: {
    fontSize: 15,
    color: APP_TEXT_COLOR,
  },
  button: {
    marginTop: 12,
    height: 44,
    borderRadius: 10,
    backgroundColor: "#2F95DC",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
});
