import {
  DESIGN_BODY_HEIGHT,
  DESIGN_CARD_HEIGHT,
  DESIGN_CARD_WIDTH,
  DESIGN_FOOTER_HEIGHT,
} from "@/src/features/soulFlower/constants";

export interface FlowerCardLayout {
  scale: number;
  cardHeight: number;
  bodyHeight: number;
  footerHeight: number;
  overflowTop: number;
  bgLeft: number;
  bgTop: number;
  bgWidth: number;
  bgHeight: number;
  flowerLeft: number;
  flowerTop: number;
  flowerWidth: number;
  flowerHeight: number;
  badgeHeight: number;
  badgeRadius: number;
  badgeMinWidth: number;
  nameSize: number;
  footerFont: number;
  badgeFont: number;
}

export function calcFlowerCardLayout(cardWidth: number): FlowerCardLayout {
  const scale = cardWidth / DESIGN_CARD_WIDTH;
  return {
    scale,
    cardHeight: cardWidth * (DESIGN_CARD_HEIGHT / DESIGN_CARD_WIDTH),
    bodyHeight: DESIGN_BODY_HEIGHT * scale,
    footerHeight: DESIGN_FOOTER_HEIGHT * scale,
    overflowTop: 18 * scale,
    bgLeft: 16 * scale,
    bgTop: 30 * scale,
    bgWidth: 250 * scale,
    bgHeight: 288 * scale,
    flowerLeft: -36 * scale,
    flowerTop: -18 * scale,
    flowerWidth: 315 * scale,
    flowerHeight: 450 * scale,
    badgeHeight: 26 * scale,
    badgeRadius: 13 * scale,
    badgeMinWidth: 60 * scale,
    nameSize: 28 * scale,
    footerFont: 15 * scale,
    badgeFont: 16 * scale,
  };
}
