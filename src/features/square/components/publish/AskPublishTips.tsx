import { SymbolView } from "expo-symbols";
import type { ComponentProps } from "react";
import { StyleSheet, Text, View } from "react-native";

import { APP_TEXT_COLOR } from "@/constants/Colors";
import { CrossStarIcon } from "@/src/components/CrossStarIcon";
import {
  ASK_PUBLISH_TIPS,
  ASK_PUBLISH_TIPS_HEADING,
  ASK_TIP_DESC_COLOR,
  ASK_TIP_ICON_BG,
  COMMENT_HIGHLIGHT_COLOR,
} from "@/src/features/square/constants";

type SymbolName = ComponentProps<typeof SymbolView>["name"];

interface TipItem {
  id: string;
  title: string;
  description: string;
  icon: SymbolName;
}

const STAR_ICON_SIZE = 16;
const TIP_ICON_SIZE = 14;
const TIP_ICON_CIRCLE = 28;
const TITLE_FONT_SIZE = 14;
const TITLE_COLUMN_CHAR_COUNT = 7;
const TITLE_COLUMN_WIDTH = TITLE_FONT_SIZE * TITLE_COLUMN_CHAR_COUNT;

const TIP_ICONS: Record<(typeof ASK_PUBLISH_TIPS)[number]["id"], SymbolName> = {
  clear: {
    ios: "text.quote",
    android: "format_quote",
    web: "format_quote",
  },
  context: {
    ios: "list.bullet",
    android: "list",
    web: "list",
  },
  focus: {
    ios: "viewfinder",
    android: "center_focus_strong",
    web: "center_focus_strong",
  },
};

const TIPS: TipItem[] = ASK_PUBLISH_TIPS.map((tip) => ({
  ...tip,
  icon: TIP_ICONS[tip.id],
}));

export function AskPublishTips() {
  return (
    <View style={styles.root}>
      <View style={styles.heading}>
        <CrossStarIcon size={STAR_ICON_SIZE} color={COMMENT_HIGHLIGHT_COLOR} />
        <Text style={styles.headingText}>{ASK_PUBLISH_TIPS_HEADING}</Text>
      </View>
      {TIPS.map((tip) => (
        <View key={tip.id} style={styles.row}>
          <View style={styles.iconCircle}>
            <SymbolView
              name={tip.icon}
              size={TIP_ICON_SIZE}
              tintColor={APP_TEXT_COLOR}
            />
          </View>
          <View style={styles.copy}>
            <Text style={styles.title}>{tip.title}</Text>
            <Text style={styles.description} numberOfLines={1}>
              {tip.description}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: 12,
  },
  heading: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  headingText: {
    fontSize: 15,
    fontWeight: "700",
    color: APP_TEXT_COLOR,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  iconCircle: {
    width: TIP_ICON_CIRCLE,
    height: TIP_ICON_CIRCLE,
    borderRadius: TIP_ICON_CIRCLE / 2,
    backgroundColor: ASK_TIP_ICON_BG,
    alignItems: "center",
    justifyContent: "center",
  },
  copy: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    width: TITLE_COLUMN_WIDTH,
    fontSize: TITLE_FONT_SIZE,
    fontWeight: "600",
    color: APP_TEXT_COLOR,
  },
  description: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    color: ASK_TIP_DESC_COLOR,
  },
});
