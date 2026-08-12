import { useMemo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { CurrentFlowerCard } from "@/src/features/soulFlower/components/CurrentFlowerCard";
import { MindMapSection } from "@/src/features/soulFlower/components/MindMapSection";
import { TodayAwarenessCard } from "@/src/features/soulFlower/components/TodayAwarenessCard";
import {
  APP_TEXT_COLOR,
  PETAL_SLOT_COUNT,
} from "@/src/features/soulFlower/constants";
import { useMindMap } from "@/src/features/soulFlower/hooks/useMindMap";
import { useTodayTask } from "@/src/features/soulFlower/hooks/useTodayTask";
import type { FlowerCardProgress } from "@/src/features/soulFlower/types";
import { findFlowerCardById } from "@/src/features/soulFlower/utils/findFlowerCard";
import { calcFlowerCardProgress } from "@/src/features/soulFlower/utils/progress";

const EMPTY_PROGRESS: FlowerCardProgress = {
  totalCount: PETAL_SLOT_COUNT,
  completedCount: 0,
  progressRatio: 0,
};

export function ExplorationOverview() {
  const { data: todayTask } = useTodayTask();
  const { flowerCards, answeredQuestionIds } = useMindMap();

  const matchedFlowerCard = useMemo(
    () => findFlowerCardById(flowerCards, todayTask?.question?.flowerId),
    [flowerCards, todayTask?.question?.flowerId],
  );

  const progress = useMemo(() => {
    if (!matchedFlowerCard) {
      return EMPTY_PROGRESS;
    }
    return calcFlowerCardProgress(matchedFlowerCard, answeredQuestionIds);
  }, [matchedFlowerCard, answeredQuestionIds]);

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>探索</Text>
          <Text style={styles.subtitle}>
            每天一道小题，看见真实生活里的自己
          </Text>
        </View>

        <View style={styles.dualCards}>
          <TodayAwarenessCard
            flowerImagePath={matchedFlowerCard?.flowerImagePath}
            progress={progress}
          />
          <CurrentFlowerCard
            flowerCard={matchedFlowerCard}
            progress={progress}
          />
        </View>

        <MindMapSection />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  content: {
    paddingBottom: 32,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 14,
    gap: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: APP_TEXT_COLOR,
  },
  subtitle: {
    fontSize: 14,
    color: APP_TEXT_COLOR,
  },
  dualCards: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 20,
    alignItems: "stretch",
  },
});
