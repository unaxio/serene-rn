import { LinearGradient } from "expo-linear-gradient";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { AwarenessAnswerModal } from "@/src/features/soulFlower/components/AwarenessAnswerModal";
import { PartnerInviteModal } from "@/src/features/soulFlower/components/PartnerInviteModal";
import { PartnerStatusModal } from "@/src/features/soulFlower/components/PartnerStatusModal";
import { StreakDetailModal } from "@/src/features/soulFlower/components/StreakDetailModal";
import { TodayResultModal } from "@/src/features/soulFlower/components/TodayResultModal";
import { APP_TEXT_COLOR, AWARENESS_ACCENT_GRADIENT, AWARENESS_ACCENT_GRADIENT_LOCATIONS } from "@/src/features/soulFlower/constants";
import { usePartnerStatus } from "@/src/features/soulFlower/hooks/usePartner";
import { useTodayTask } from "@/src/features/soulFlower/hooks/useTodayTask";
import type { FlowerCardProgress } from "@/src/features/soulFlower/types";

interface TodayAwarenessCardProps {
  flowerImagePath?: string | null;
  progress: FlowerCardProgress;
}

export function TodayAwarenessCard({
  flowerImagePath,
  progress,
}: TodayAwarenessCardProps) {
  const { data, isLoading, isError, refetch, submitAnswer, finalizeSubmit } =
    useTodayTask();
  const { data: partnerStatus } = usePartnerStatus();

  const [answerVisible, setAnswerVisible] = useState(false);
  const [resultVisible, setResultVisible] = useState(false);
  const [streakVisible, setStreakVisible] = useState(false);
  const [inviteVisible, setInviteVisible] = useState(false);
  const [partnerVisible, setPartnerVisible] = useState(false);

  const alreadyAnswered = data?.alreadyAnswered === true;
  const hasTask = data?.hasTask === true && Boolean(data.question);
  const myStreakCount = partnerStatus?.myStreakCount ?? 0;
  const partnerStreakCount = partnerStatus?.partnerStreakCount ?? 0;
  const hasPartner = partnerStatus?.hasPartner === true;

  const handlePrimary = useCallback(() => {
    if (alreadyAnswered) {
      setResultVisible(true);
      return;
    }
    if (hasTask) {
      setAnswerVisible(true);
    }
  }, [alreadyAnswered, hasTask]);

  const handleAlliance = useCallback(() => {
    if (hasPartner) {
      setPartnerVisible(true);
      return;
    }
    setInviteVisible(true);
  }, [hasPartner]);

  const handleSubmit = useCallback(
    async (answerContent: string) => {
      if (!data?.question) {
        return null;
      }
      return submitAnswer(data.question.id, answerContent);
    },
    [data?.question, submitAnswer],
  );

  const handleAnswerClose = useCallback(() => {
    setAnswerVisible(false);
  }, []);

  const handleAnswerCompleted = useCallback(() => {
    setResultVisible(true);
  }, []);

  if (isLoading) {
    return (
      <View style={styles.card}>
        <ActivityIndicator color="#7B6CF9" />
      </View>
    );
  }

  if (isError || !data) {
    return (
      <View style={styles.card}>
        <Text style={styles.errorText}>加载失败</Text>
        <Pressable onPress={() => void refetch()}>
          <Text style={styles.retry}>重试</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <Text style={styles.title}>今日觉察</Text>
      <Text style={styles.subtitle}>给自己一个温柔的开始。</Text>

      <View style={styles.statusRow}>
        <Text style={styles.statusIcon}>{alreadyAnswered ? "✓" : "○"}</Text>
        <Text style={styles.statusText}>
          今日任务：{alreadyAnswered ? "已完成" : "未完成"}
        </Text>
      </View>

      <Pressable
        onPress={handlePrimary}
        disabled={!alreadyAnswered && !hasTask}
        style={[
          styles.primaryButtonWrap,
          !alreadyAnswered && !hasTask ? styles.disabled : undefined,
        ]}
      >
        <LinearGradient
          colors={[...AWARENESS_ACCENT_GRADIENT]}
          locations={[...AWARENESS_ACCENT_GRADIENT_LOCATIONS]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.primaryButton}
        >
          <Text style={styles.primaryText}>
            {alreadyAnswered ? "查看今日结果" : "开始今日觉察"}
          </Text>
        </LinearGradient>
      </Pressable>

      <Text style={styles.hint}>
        {alreadyAnswered
          ? "下次觉察：明日 00:00，继续看见自己"
          : "完成今日觉察，更新花卡成长状态"}
      </Text>

      <Pressable style={styles.infoBar} onPress={() => setStreakVisible(true)}>
        <Text style={styles.infoText}>🔥 连续觉察 第 {myStreakCount} 天 ›</Text>
      </Pressable>

      <Pressable style={styles.infoBar} onPress={handleAlliance}>
        <Text style={styles.infoText}>
          {hasPartner
            ? `👥 双人联盟 携手 ${partnerStreakCount} 天 ›`
            : "👥 双人联盟 邀请伙伴 ›"}
        </Text>
      </Pressable>

      <AwarenessAnswerModal
        visible={answerVisible}
        question={data.question}
        onClose={handleAnswerClose}
        onSubmit={handleSubmit}
        onFinalize={finalizeSubmit}
        onCompleted={handleAnswerCompleted}
      />
      <TodayResultModal
        visible={resultVisible}
        onClose={() => setResultVisible(false)}
        flowerImagePath={flowerImagePath}
        partnerStatus={partnerStatus}
        progress={progress}
      />
      <StreakDetailModal
        visible={false && streakVisible}
        onClose={() => setStreakVisible(false)}
        partnerStatus={partnerStatus}
      />
      <PartnerInviteModal
        visible={inviteVisible}
        onClose={() => setInviteVisible(false)}
      />
      <PartnerStatusModal
        visible={partnerVisible}
        onClose={() => setPartnerVisible(false)}
        partnerStatus={partnerStatus}
      />
    </View>
  );
}

const CARD_BORDER_COLOR = "#eeeff3";
const INFO_BAR_MIN_HEIGHT = 52;
const INFO_BAR_RADIUS = 12;
const PRIMARY_BUTTON_HEIGHT = 40;
const PRIMARY_BUTTON_RADIUS = PRIMARY_BUTTON_HEIGHT / 2;
const PRIMARY_BUTTON_SHADOW_COLOR = AWARENESS_ACCENT_GRADIENT[1];
const PRIMARY_BUTTON_SHADOW_OFFSET = { width: 0, height: 4 } as const;
const PRIMARY_BUTTON_SHADOW_OPACITY = 0.45;
const PRIMARY_BUTTON_SHADOW_RADIUS = 8;
const PRIMARY_BUTTON_ELEVATION = 6;

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: "transparent",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: CARD_BORDER_COLOR,
    gap: 8,
    minHeight: 280,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: APP_TEXT_COLOR,
  },
  subtitle: {
    fontSize: 12,
    color: APP_TEXT_COLOR,
    marginBottom: 2,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statusIcon: {
    fontSize: 13,
    color: "#22C55E",
  },
  statusText: {
    fontSize: 12,
    color: APP_TEXT_COLOR,
    fontWeight: "500",
  },
  primaryButtonWrap: {
    marginTop: 4,
    borderRadius: PRIMARY_BUTTON_RADIUS,
    backgroundColor: AWARENESS_ACCENT_GRADIENT[1],
    shadowColor: PRIMARY_BUTTON_SHADOW_COLOR,
    shadowOffset: PRIMARY_BUTTON_SHADOW_OFFSET,
    shadowOpacity: PRIMARY_BUTTON_SHADOW_OPACITY,
    shadowRadius: PRIMARY_BUTTON_SHADOW_RADIUS,
    elevation: PRIMARY_BUTTON_ELEVATION,
  },
  primaryButton: {
    height: PRIMARY_BUTTON_HEIGHT,
    borderRadius: PRIMARY_BUTTON_RADIUS,
    alignItems: "center",
    justifyContent: "center",
  },
  disabled: {
    opacity: 0.5,
  },
  primaryText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
  hint: {
    fontSize: 11,
    color: "#94A3B8",
    lineHeight: 16,
  },
  infoBar: {
    flex: 1,
    minHeight: INFO_BAR_MIN_HEIGHT,
    justifyContent: "center",
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: INFO_BAR_RADIUS,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: CARD_BORDER_COLOR,
  },
  infoText: {
    fontSize: 13,
    color: APP_TEXT_COLOR,
    fontWeight: "600",
    lineHeight: 18,
  },
  errorText: {
    fontSize: 13,
    color: "#B91C1C",
  },
  retry: {
    fontSize: 13,
    color: "#7B6CF9",
    fontWeight: "600",
  },
});
