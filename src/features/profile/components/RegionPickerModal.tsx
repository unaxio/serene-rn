import { FlashList } from '@shopify/flash-list';
import { isAxiosError } from 'axios';
import { useCallback, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { FullScreenModal } from '@/src/components/FullScreenModal';
import {
  PROFILE_ACCENT,
  PROFILE_MUTED,
  REGION_EMPTY_MESSAGE,
  REGION_LOAD_ERROR,
  REGION_NOT_LEAF_MESSAGE,
  REGION_PICKER_TITLE,
} from '@/src/features/profile/constants';
import { useRegionPicker } from '@/src/features/profile/hooks/useRegionPicker';
import { RegionPickerBreadcrumb } from '@/src/features/profile/components/RegionPickerBreadcrumb';
import { RegionPickerRow } from '@/src/features/profile/components/RegionPickerRow';
import { getRegionDetail } from '@/src/features/profile/regionApi';
import type { RegionOption, RegionSelection } from '@/src/features/profile/regionTypes';
import { formatRegionPath } from '@/src/features/profile/utils/regionPath';
import { toastCaughtFailure } from '@/src/utils/requestError';
import { showErrorToast } from '@/src/utils/toast';

interface RegionPickerModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (selection: RegionSelection) => void;
}

export function RegionPickerModal({ visible, onClose, onSelect }: RegionPickerModalProps) {
  const { crumbs, items, isLoading, isError, refetch, goBack, jumpTo, openChild } =
    useRegionPicker(visible);
  const [pendingCode, setPendingCode] = useState<string | null>(null);
  const pendingRef = useRef<string | null>(null);

  const handleBack = useCallback(() => {
    if (pendingRef.current) {
      return;
    }
    if (!goBack()) {
      onClose();
    }
  }, [goBack, onClose]);

  const handlePress = useCallback(
    async (item: RegionOption) => {
      if (pendingRef.current) {
        return;
      }
      if (!item.leaf) {
        openChild(item);
        return;
      }
      pendingRef.current = item.code;
      setPendingCode(item.code);
      const localLabel = formatRegionPath([...crumbs.map((crumb) => crumb.name), item.name]);
      try {
        const detail = await getRegionDetail(item.code);
        if (!detail.leaf) {
          showErrorToast(REGION_NOT_LEAF_MESSAGE);
          return;
        }
        onSelect({ cityCode: detail.code, label: detail.fullPath || localLabel });
      } catch (error) {
        if (isAxiosError(error)) {
          toastCaughtFailure(error);
          return;
        }
        // 详情字段对不上时，列表已经标明这是最后一级，用面包屑拼出的地名仍可保存
        onSelect({ cityCode: item.code, label: localLabel });
      } finally {
        pendingRef.current = null;
        setPendingCode(null);
      }
    },
    [crumbs, onSelect, openChild],
  );

  const renderItem = useCallback(
    ({ item }: { item: RegionOption }) => (
      <RegionPickerRow item={item} pending={pendingCode === item.code} onPress={handlePress} />
    ),
    [handlePress, pendingCode],
  );

  return (
    <FullScreenModal visible={visible} title={REGION_PICKER_TITLE} onBack={handleBack}>
      <View style={styles.root}>
        <RegionPickerBreadcrumb crumbs={crumbs} onJump={jumpTo} />
        {isLoading ? <ActivityIndicator style={styles.status} color={PROFILE_ACCENT} /> : null}
        {isError ? (
          <Pressable onPress={() => void refetch()}>
            <Text style={styles.empty}>{REGION_LOAD_ERROR}</Text>
          </Pressable>
        ) : null}
        <View style={styles.list}>
          <FlashList
            data={items}
            renderItem={renderItem}
            keyExtractor={(item) => item.code}
            ListEmptyComponent={
              isLoading || isError ? null : <Text style={styles.empty}>{REGION_EMPTY_MESSAGE}</Text>
            }
          />
        </View>
      </View>
    </FullScreenModal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  list: { flex: 1 },
  status: { paddingVertical: 24 },
  empty: {
    textAlign: 'center',
    color: PROFILE_MUTED,
    fontSize: 14,
    paddingVertical: 32,
  },
});
