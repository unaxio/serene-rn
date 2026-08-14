import { Image } from "expo-image";
import { useMemo, useState } from "react";
import { LayoutChangeEvent, StyleSheet, Text, View } from "react-native";

import { FlowerCardMetaOverlay } from "@/src/features/soulFlower/components/detail/FlowerCardMetaOverlay";
import { PetalProgressBar } from "@/src/features/soulFlower/components/detail/PetalProgressBar";
import {
  APP_TEXT_COLOR,
  CARD_CORNER_RADIUS,
  CARD_HORIZONTAL_MARGIN,
  DEFAULT_THEME_COLOR,
  DESIGN_CARD_WIDTH,
  FLOWER_CARD_INNER_BG,
  FLOWER_THEME_HEX,
} from "@/src/features/soulFlower/constants";
import type {
  FlowerCard,
  FlowerCardProgress,
} from "@/src/features/soulFlower/types";
import { calcFlowerCardLayout } from "@/src/features/soulFlower/utils/cardLayout";
import {
  formatProgressLabel,
  getFlowerPhaseImagePath,
} from "@/src/features/soulFlower/utils/progress";
import { resolveCdnUrl } from "@/src/utils/cdn";

interface FlowerCardShowcaseProps {
  card: FlowerCard;
  categoryName: string;
  progress: FlowerCardProgress;
}

const CARD_BORDER_COLOR = "#DBDBDB";
const IMAGE_BLUR_RADIUS = 12;

export function FlowerCardShowcase({
  card,
  categoryName,
  progress,
}: FlowerCardShowcaseProps) {
  const [cardWidth, setCardWidth] = useState(DESIGN_CARD_WIDTH);
  const layout = useMemo(() => calcFlowerCardLayout(cardWidth), [cardWidth]);
  const flowerHex =
    FLOWER_THEME_HEX[card.themeColor] ?? FLOWER_THEME_HEX[DEFAULT_THEME_COLOR];
  const isLocked = progress.completedCount === 0;
  const flowerUri = resolveCdnUrl(
    getFlowerPhaseImagePath(card, progress.completedCount),
  );
  const languageMaxHeight = Math.max(
    40,
    layout.bodyHeight -
      layout.badgeHeight -
      layout.nameSize -
      48 * layout.scale,
  );

  const handleLayout = (event: LayoutChangeEvent) => {
    const nextWidth = event.nativeEvent.layout.width;
    if (nextWidth > 0 && Math.abs(nextWidth - cardWidth) > 1) {
      setCardWidth(nextWidth);
    }
  };

  return (
    <View style={[styles.stage, { paddingTop: layout.overflowTop }]}>
      <View
        onLayout={handleLayout}
        style={[
          styles.card,
          { height: layout.cardHeight, borderRadius: CARD_CORNER_RADIUS },
        ]}
      >
        <View style={[styles.body, { height: layout.bodyHeight }]}>
          <Image
            source={FLOWER_CARD_INNER_BG}
            style={{
              position: "absolute",
              left: layout.bgLeft,
              top: layout.bgTop,
              width: layout.bgWidth,
              height: layout.bgHeight,
            }}
            contentFit="contain"
          />
        </View>
        <View style={[styles.footer, { height: layout.footerHeight }]}>
          <Text style={[styles.footerLabel, { fontSize: layout.footerFont }]}>
            成长进度
          </Text>
          <PetalProgressBar
            completedCount={progress.completedCount}
            themeColor={card.themeColor}
            flowerHex={flowerHex}
            scale={layout.scale}
          />
          <Text
            style={[
              styles.footerLabel,
              styles.footerProgress,
              { fontSize: layout.footerFont },
            ]}
          >
            {formatProgressLabel(progress.completedCount, progress.totalCount)}
          </Text>
        </View>
      </View>

      {flowerUri ? (
        <Image
          source={{ uri: flowerUri }}
          pointerEvents="none"
          blurRadius={isLocked ? IMAGE_BLUR_RADIUS : 0}
          contentFit="contain"
          style={{
            position: "absolute",
            left: CARD_HORIZONTAL_MARGIN + layout.flowerLeft,
            top: layout.overflowTop + layout.flowerTop,
            width: layout.flowerWidth,
            height: layout.flowerHeight,
            zIndex: 2,
          }}
        />
      ) : null}

      <FlowerCardMetaOverlay
        categoryName={categoryName}
        flowerName={card.flowerName}
        language={card.language || card.title}
        flowerHex={flowerHex}
        layout={layout}
        languageMaxHeight={languageMaxHeight}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  stage: {
    paddingHorizontal: CARD_HORIZONTAL_MARGIN,
  },
  card: {
    width: "100%",
    borderWidth: 1,
    borderColor: CARD_BORDER_COLOR,
    backgroundColor: "#F7F6F5",
    overflow: "hidden",
    shadowColor: "#9CA3AF",
    shadowOpacity: 0.35,
    shadowRadius: 8,
    shadowOffset: { width: 4, height: 6 },
    elevation: 4,
  },
  body: {
    borderBottomWidth: 1,
    borderBottomColor: CARD_BORDER_COLOR,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
  },
  footerLabel: {
    color: APP_TEXT_COLOR,
    fontWeight: "500",
  },
  footerProgress: {
    letterSpacing: 1.5,
  },
});
