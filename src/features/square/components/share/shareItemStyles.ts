import { StyleSheet } from 'react-native';

import { APP_TEXT_COLOR } from '@/constants/Colors';
import {
  CARD_BORDER_COLOR,
  SHARE_BODY_GAP,
  SHARE_DIVIDER_WIDTH,
  SHARE_ITEM_PADDING_H,
  SHARE_ITEM_PADDING_V,
  SHARE_NAME_ROW_GAP,
  SHARE_SIDEBAR_WIDTH,
} from '@/src/features/square/constants';

export const shareItemStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: SHARE_ITEM_PADDING_H,
    paddingVertical: SHARE_ITEM_PADDING_V,
    borderBottomWidth: SHARE_DIVIDER_WIDTH,
    borderBottomColor: CARD_BORDER_COLOR,
  },
  sidebar: {
    width: SHARE_SIDEBAR_WIDTH,
    alignItems: 'center',
  },
  body: {
    flex: 1,
    gap: SHARE_BODY_GAP,
    minWidth: 0,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SHARE_NAME_ROW_GAP,
  },
  moreWrap: {
    marginLeft: 'auto',
  },
  name: {
    flexShrink: 1,
    fontSize: 15,
    fontWeight: '600',
    color: APP_TEXT_COLOR,
  },
  content: {
    fontSize: 15,
    lineHeight: 22,
    color: APP_TEXT_COLOR,
  },
});
