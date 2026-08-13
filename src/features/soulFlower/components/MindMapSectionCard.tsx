import { memo, useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";

import { FlowerImage } from "@/src/features/soulFlower/components/FlowerImage";
import {
  APP_TEXT_COLOR,
  DEFAULT_THEME_COLOR,
  THEME_COLOR_STYLES,
} from "@/src/features/soulFlower/constants";
import type { FlowerCard } from "@/src/features/soulFlower/types";
import {
  calcFlowerCardProgress,
  formatProgressLabel,
} from "@/src/features/soulFlower/utils/progress";

/**
 * 探索 Tab 认知图谱 Section 专用花卡。
 * 样式从 MindMapGridCard 复制而来，便于后续与弹窗卡片各自演进。
 */
interface MindMapSectionCardProps {
  card: FlowerCard;
  categoryName: string;
  answeredQuestionIds: string[];
}

function MindMapSectionCardComponent({
  card,
  categoryName,
  answeredQuestionIds,
}: MindMapSectionCardProps) {
  const theme =
    THEME_COLOR_STYLES[card.themeColor] ??
    THEME_COLOR_STYLES[DEFAULT_THEME_COLOR];

  const { completedCount, totalCount } = useMemo(
    () => calcFlowerCardProgress(card, answeredQuestionIds),
    [card, answeredQuestionIds],
  );

  return (
    <View style={styles.card}>
      <Text style={styles.flowerName} numberOfLines={1}>
        {card.flowerName}
      </Text>
      <View style={[styles.tag, { backgroundColor: theme.background }]}>
        <Text style={[styles.tagText, { color: theme.text }]} numberOfLines={1}>
          {categoryName}
        </Text>
      </View>

      <View style={styles.imageWrap}>
        <FlowerImage
          imagePath={card.flowerImagePath}
          size={88}
          locked={completedCount === 0}
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.flowerLanguage} numberOfLines={2}>
          {card.title || card.language}
        </Text>
        <Text style={styles.progress}>
          {formatProgressLabel(completedCount, totalCount)}
        </Text>
      </View>
    </View>
  );
}

export const MindMapSectionCard = memo(MindMapSectionCardComponent);

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingTop: 10,
    paddingBottom: 8,
    paddingHorizontal: 6,
    marginBottom: 10,
    minHeight: 168,
    // 轻微阴影勾勒卡片轮廓
    shadowColor: "#1F195C",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    position: "relative",
  },
  flowerName: {
    position: "absolute",
    top: 8,
    left: 8,
    zIndex: 2,
    maxWidth: "55%",
    fontSize: 11,
    fontWeight: "700",
    color: APP_TEXT_COLOR,
  },
  tag: {
    position: "absolute",
    top: 8,
    right: 6,
    zIndex: 2,
    maxWidth: "42%",
    borderRadius: 999,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  tagText: {
    fontSize: 9,
    fontWeight: "600",
  },
  imageWrap: {
    marginTop: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  footer: {
    marginTop: 6,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 4,
    paddingHorizontal: 2,
  },
  flowerLanguage: {
    flex: 1,
    fontSize: 9,
    lineHeight: 12,
    color: "#64748B",
  },
  progress: {
    fontSize: 11,
    fontWeight: "700",
    color: APP_TEXT_COLOR,
  },
});
