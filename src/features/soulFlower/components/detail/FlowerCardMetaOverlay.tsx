import { StyleSheet, Text, View } from 'react-native';

import { VerticalLanguageText } from '@/src/features/soulFlower/components/detail/VerticalLanguageText';
import { APP_TEXT_COLOR, CARD_HORIZONTAL_MARGIN } from '@/src/features/soulFlower/constants';
import type { FlowerCardLayout } from '@/src/features/soulFlower/utils/cardLayout';

interface FlowerCardMetaOverlayProps {
  categoryName: string;
  flowerName: string;
  language: string;
  flowerHex: string;
  layout: FlowerCardLayout;
  languageMaxHeight: number;
}

export function FlowerCardMetaOverlay({
  categoryName,
  flowerName,
  language,
  flowerHex,
  layout,
  languageMaxHeight,
}: FlowerCardMetaOverlayProps) {
  return (
    <View
      pointerEvents="none"
      style={[
        styles.textLayer,
        {
          top: layout.overflowTop,
          height: layout.bodyHeight,
          paddingTop: 30 * layout.scale,
          paddingRight: 28 * layout.scale,
        },
      ]}>
      <View
        style={[
          styles.badge,
          {
            height: layout.badgeHeight,
            minWidth: layout.badgeMinWidth,
            borderRadius: layout.badgeRadius,
            borderColor: flowerHex,
            paddingHorizontal: 12 * layout.scale,
          },
        ]}>
        <Text
          style={[
            styles.badgeText,
            { color: flowerHex, fontSize: layout.badgeFont, lineHeight: layout.badgeFont + 4 },
          ]}
          numberOfLines={1}>
          {categoryName}
        </Text>
      </View>
      <Text
        style={[styles.flowerName, { fontSize: layout.nameSize, lineHeight: 34 * layout.scale }]}
        numberOfLines={1}>
        {flowerName}
      </Text>
      <VerticalLanguageText
        text={language}
        quoteColor={flowerHex}
        maxHeight={languageMaxHeight}
        scale={layout.scale}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  textLayer: {
    position: 'absolute',
    right: CARD_HORIZONTAL_MARGIN,
    left: CARD_HORIZONTAL_MARGIN,
    alignItems: 'flex-end',
    zIndex: 3,
  },
  badge: {
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontWeight: '300',
    textAlign: 'center',
  },
  flowerName: {
    marginTop: 8,
    fontWeight: '300',
    color: APP_TEXT_COLOR,
  },
});
