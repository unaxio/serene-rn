import { SymbolView } from 'expo-symbols';
import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { APP_TEXT_COLOR } from '@/constants/Colors';
import { BottomSheetModal } from '@/src/components/BottomSheetModal';
import {
  COMING_SOON_MESSAGE,
  MUTED_TEXT_COLOR,
  SEARCH_BAR_BG,
} from '@/src/features/square/constants';
import {
  buildContentMoreActions,
  type ContentMoreActionId,
  type ContentMoreKind,
} from '@/src/features/square/utils/contentMoreActions';
import { showToast } from '@/src/utils/toast';

interface ContentMoreMenuProps {
  visible: boolean;
  onClose: () => void;
  isOwn: boolean;
  contentKind: ContentMoreKind;
  isFollowing?: boolean;
  onAction?: (actionId: ContentMoreActionId) => void;
}

const HANDLE_WIDTH = 36;
const HANDLE_HEIGHT = 4;
const SHEET_RADIUS = 16;
const SHEET_MIN_BOTTOM = 12;
const GRID_COLUMNS = 4;
const ICON_BOX_SIZE = 52;
const ICON_SIZE = 22;
const ICON_BOX_RADIUS = 12;
const ITEM_VERTICAL_GAP = 20;
const ITEM_WIDTH_PERCENT = `${100 / GRID_COLUMNS}%` as const;

export function ContentMoreMenu({
  visible,
  onClose,
  isOwn,
  contentKind,
  isFollowing = false,
  onAction,
}: ContentMoreMenuProps) {
  const insets = useSafeAreaInsets();
  const actions = useMemo(
    () => buildContentMoreActions({ isOwn, contentKind, isFollowing }),
    [contentKind, isFollowing, isOwn],
  );

  const handlePress = (actionId: ContentMoreActionId) => {
    onClose();
    if (onAction) {
      onAction(actionId);
      return;
    }
    showToast(COMING_SOON_MESSAGE);
  };

  return (
    <BottomSheetModal visible={visible} onClose={onClose}>
      <View
        style={[
          styles.sheet,
          { paddingBottom: Math.max(insets.bottom, SHEET_MIN_BOTTOM) },
        ]}>
        <View style={styles.handle} />
        <View style={styles.grid}>
          {actions.map((action) => (
            <Pressable
              key={action.id}
              style={styles.item}
              onPress={() => handlePress(action.id)}>
              <View style={styles.iconBox}>
                <SymbolView
                  name={action.icon}
                  size={ICON_SIZE}
                  tintColor={APP_TEXT_COLOR}
                />
              </View>
              <Text style={styles.label} numberOfLines={1}>
                {action.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: SHEET_RADIUS,
    borderTopRightRadius: SHEET_RADIUS,
    paddingHorizontal: 12,
    paddingTop: 10,
  },
  handle: {
    alignSelf: 'center',
    width: HANDLE_WIDTH,
    height: HANDLE_HEIGHT,
    borderRadius: HANDLE_HEIGHT / 2,
    backgroundColor: '#E2E8F0',
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  item: {
    width: ITEM_WIDTH_PERCENT,
    alignItems: 'center',
    gap: 8,
    marginBottom: ITEM_VERTICAL_GAP,
    paddingHorizontal: 4,
  },
  iconBox: {
    width: ICON_BOX_SIZE,
    height: ICON_BOX_SIZE,
    borderRadius: ICON_BOX_RADIUS,
    backgroundColor: SEARCH_BAR_BG,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 12,
    color: MUTED_TEXT_COLOR,
    textAlign: 'center',
  },
});
