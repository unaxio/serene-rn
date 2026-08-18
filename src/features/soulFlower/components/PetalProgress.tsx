import { Image } from "expo-image";
import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";

import {
  APP_TEXT_COLOR,
  PETAL_BLANK_IMAGE,
  PETAL_DEFAULT_IMAGE,
  PETAL_SLOT_COUNT,
} from "@/src/features/soulFlower/constants";

interface PetalProgressProps {
  completedCount: number;
  totalCount: number;
}

const PETAL_SIZE = 12;
const PROGRESS_ROW_WIDTH_RATIO = "80%" as const;

export function PetalProgress({
  completedCount,
  totalCount,
}: PetalProgressProps) {
  const filledCount = Math.min(completedCount, PETAL_SLOT_COUNT);
  const displayTotal = totalCount > 0 ? totalCount : PETAL_SLOT_COUNT;
  const slots = useMemo(
    () => Array.from({ length: PETAL_SLOT_COUNT }, (_, index) => index),
    [],
  );

  return (
    <View style={styles.row}>
      <View style={styles.petals}>
        {slots.map((index) => (
          <Image
            key={`petal-${index}`}
            source={
              index < filledCount ? PETAL_DEFAULT_IMAGE : PETAL_BLANK_IMAGE
            }
            style={styles.petal}
            contentFit="contain"
          />
        ))}
      </View>
      <Text style={styles.label}>
        {filledCount} / {displayTotal}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    width: PROGRESS_ROW_WIDTH_RATIO,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  petals: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  petal: {
    width: PETAL_SIZE,
    height: PETAL_SIZE,
  },
  label: {
    fontSize: 12,
    fontWeight: "500",
    color: APP_TEXT_COLOR,
    letterSpacing: 1.5,
  },
});
