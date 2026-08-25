import type { ImageSource } from "expo-image";

export type CategoryEnName =
  | "self"
  | "emotion"
  | "career"
  | "parenting"
  | "relationship"
  | "mood"
  | "growth";

interface CategoryUiAssets {
  icon: ImageSource;
  iconActive: ImageSource;
  bgActive: ImageSource;
}

export const CATEGORY_NAME_TO_EN: Record<string, CategoryEnName> = {
  自我: "self",
  婚恋: "emotion",
  职场: "career",
  育儿: "parenting",
  家庭: "relationship",
  情绪: "mood",
  身心: "growth",
};

export const CATEGORY_UI_ASSETS: Record<CategoryEnName, CategoryUiAssets> = {
  self: {
    icon: require("@/assets/images/explore_categories_ui/self_icon.png"),
    iconActive: require("@/assets/images/explore_categories_ui/self_icon_active.png"),
    bgActive: require("@/assets/images/explore_categories_ui/self_bg_active.png"),
  },
  emotion: {
    icon: require("@/assets/images/explore_categories_ui/emotion_icon.png"),
    iconActive: require("@/assets/images/explore_categories_ui/emotion_icon_active.png"),
    bgActive: require("@/assets/images/explore_categories_ui/emotion_bg_active.png"),
  },
  career: {
    icon: require("@/assets/images/explore_categories_ui/career_icon.png"),
    iconActive: require("@/assets/images/explore_categories_ui/career_icon_active.png"),
    bgActive: require("@/assets/images/explore_categories_ui/career_bg_active.png"),
  },
  parenting: {
    icon: require("@/assets/images/explore_categories_ui/parenting_icon.png"),
    iconActive: require("@/assets/images/explore_categories_ui/parenting_icon_active.png"),
    bgActive: require("@/assets/images/explore_categories_ui/parenting_bg_active.png"),
  },
  relationship: {
    icon: require("@/assets/images/explore_categories_ui/relationship_icon.png"),
    iconActive: require("@/assets/images/explore_categories_ui/relationship_icon_active.png"),
    bgActive: require("@/assets/images/explore_categories_ui/relationship_bg_active.png"),
  },
  mood: {
    icon: require("@/assets/images/explore_categories_ui/mood_icon.png"),
    iconActive: require("@/assets/images/explore_categories_ui/mood_icon_active.png"),
    bgActive: require("@/assets/images/explore_categories_ui/mood_bg_active.png"),
  },
  growth: {
    icon: require("@/assets/images/explore_categories_ui/growth_icon.png"),
    iconActive: require("@/assets/images/explore_categories_ui/growth_icon_active.png"),
    bgActive: require("@/assets/images/explore_categories_ui/growth_bg_active.png"),
  },
};

export function getCategoryUiAssets(name: string): CategoryUiAssets | null {
  const enName = CATEGORY_NAME_TO_EN[name];
  if (!enName) {
    return null;
  }
  return CATEGORY_UI_ASSETS[enName];
}
