import { FlashList } from '@shopify/flash-list';
import { useCallback } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { FullScreenModal } from '@/src/components/FullScreenModal';
import { FlowerLedgerRow } from '@/src/features/square/components/flowerLedger/FlowerLedgerRow';
import {
  ACCENT_COLOR,
  FLOWER_LEDGER_EMPTY,
  FLOWER_LEDGER_LOAD_ERROR,
  FLOWER_LEDGER_MODAL_TITLE,
  MUTED_TEXT_COLOR,
} from '@/src/features/square/constants';
import type { useGiftFlowerLedgers } from '@/src/features/square/hooks/useGiftFlowerLedgers';
import type { GiftFlowerLedger } from '@/src/features/square/types';

interface FlowerLedgerModalProps {
  visible: boolean;
  ledgers: ReturnType<typeof useGiftFlowerLedgers>;
  onClose: () => void;
}

const END_REACHED_THRESHOLD = 0.4;

export function FlowerLedgerModal({ visible, ledgers, onClose }: FlowerLedgerModalProps) {
  const renderItem = useCallback(
    ({ item }: { item: GiftFlowerLedger }) => <FlowerLedgerRow item={item} />,
    [],
  );

  const listEmpty = (() => {
    if (ledgers.isLoading) {
      return <ActivityIndicator style={styles.status} color={ACCENT_COLOR} />;
    }
    if (ledgers.isError) {
      return (
        <View style={styles.status}>
          <Text style={styles.statusText}>{FLOWER_LEDGER_LOAD_ERROR}</Text>
          <Pressable onPress={() => void ledgers.refresh()}>
            <Text style={styles.retry}>重试</Text>
          </Pressable>
        </View>
      );
    }
    return <Text style={styles.statusText}>{FLOWER_LEDGER_EMPTY}</Text>;
  })();

  return (
    <FullScreenModal visible={visible} title={FLOWER_LEDGER_MODAL_TITLE} onBack={onClose}>
      <View style={styles.root}>
        <FlashList
          data={ledgers.items}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          onEndReached={ledgers.loadMore}
          onEndReachedThreshold={END_REACHED_THRESHOLD}
          ListEmptyComponent={listEmpty}
          ListFooterComponent={
            ledgers.isFetchingNextPage ? (
              <ActivityIndicator style={styles.footer} color={ACCENT_COLOR} />
            ) : null
          }
        />
      </View>
    </FullScreenModal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  status: {
    paddingVertical: 48,
    alignItems: 'center',
    gap: 8,
  },
  statusText: {
    textAlign: 'center',
    fontSize: 14,
    color: MUTED_TEXT_COLOR,
    paddingVertical: 48,
  },
  retry: {
    fontSize: 14,
    fontWeight: '600',
    color: ACCENT_COLOR,
  },
  footer: {
    paddingVertical: 16,
  },
});
