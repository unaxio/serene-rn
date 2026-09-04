import { LinearGradient } from 'expo-linear-gradient';
import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { APP_TEXT_COLOR } from '@/constants/Colors';
import { FlowerLedgerAvatarStrip } from '@/src/features/square/components/flowerLedger/FlowerLedgerAvatarStrip';
import {
  CARD_BORDER_COLOR,
  FLOWER_LEDGER_CHEVRON_SIZE,
  FLOWER_LEDGER_COUNT_PREFIX,
  FLOWER_LEDGER_COUNT_SUFFIX,
  FLOWER_LEDGER_SEND_GRADIENT,
  FLOWER_LEDGER_SEND_LABEL,
  FLOWER_LEDGER_SUBTITLE,
  FLOWER_LEDGER_TITLE,
  MUTED_TEXT_COLOR,
} from '@/src/features/square/constants';
import type { useGiftFlowerLedgers } from '@/src/features/square/hooks/useGiftFlowerLedgers';

interface StoryFlowerLedgerCardProps {
  ledgers: ReturnType<typeof useGiftFlowerLedgers>;
  onSendFlower: () => void;
  onOpenRecords: () => void;
}

const SEND_BUTTON_RADIUS = 16;
const CHEVRON_BORDER_WIDTH = 1;
const CARD_BORDER_WIDTH = 1;
const CHEVRON_ICON_SIZE = 10;

export function StoryFlowerLedgerCard({
  ledgers,
  onSendFlower,
  onOpenRecords,
}: StoryFlowerLedgerCardProps) {
  return (
    <Pressable style={styles.card} onPress={onOpenRecords}>
      <View style={styles.top}>
        <View style={styles.copy}>
          <Text style={styles.title}>{FLOWER_LEDGER_TITLE}</Text>
          <Text style={styles.subtitle}>{FLOWER_LEDGER_SUBTITLE}</Text>
        </View>
        <Pressable onPress={onSendFlower} style={styles.sendWrap}>
          <LinearGradient
            colors={FLOWER_LEDGER_SEND_GRADIENT}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.sendButton}>
            <Text style={styles.sendLabel}>{FLOWER_LEDGER_SEND_LABEL}</Text>
          </LinearGradient>
        </Pressable>
      </View>
      <View style={styles.bottom}>
        <Text style={styles.count}>
          {FLOWER_LEDGER_COUNT_PREFIX}
          {ledgers.total}
          {FLOWER_LEDGER_COUNT_SUFFIX}
        </Text>
        <FlowerLedgerAvatarStrip
          items={ledgers.items}
          hasNextPage={ledgers.hasNextPage}
          isFetchingNextPage={ledgers.isFetchingNextPage}
          loadMore={ledgers.loadMore}
        />
        <View style={styles.chevron}>
          <SymbolView
            name={{
              ios: 'chevron.right',
              android: 'arrow_forward_ios',
              web: 'arrow_forward_ios',
            }}
            size={CHEVRON_ICON_SIZE}
            tintColor={MUTED_TEXT_COLOR}
          />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: CARD_BORDER_WIDTH,
    borderColor: CARD_BORDER_COLOR,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    gap: 12,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  copy: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: APP_TEXT_COLOR,
  },
  subtitle: {
    fontSize: 12,
    lineHeight: 18,
    color: MUTED_TEXT_COLOR,
  },
  sendWrap: {
    borderRadius: SEND_BUTTON_RADIUS,
    overflow: 'hidden',
  },
  sendButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: SEND_BUTTON_RADIUS,
  },
  sendLabel: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  bottom: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  count: {
    flexShrink: 0,
    fontSize: 13,
    color: APP_TEXT_COLOR,
  },
  chevron: {
    flexShrink: 0,
    width: FLOWER_LEDGER_CHEVRON_SIZE,
    height: FLOWER_LEDGER_CHEVRON_SIZE,
    borderRadius: FLOWER_LEDGER_CHEVRON_SIZE / 2,
    borderWidth: CHEVRON_BORDER_WIDTH,
    borderColor: CARD_BORDER_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
