import { StyleSheet } from 'react-native';

import { APP_TEXT_COLOR } from '@/constants/Colors';
import {
  MUTED_TEXT_COLOR,
  PAGE_SURFACE_COLOR,
  SEARCH_BAR_BG,
  SEARCH_HOT_RANK_COLOR,
  SEARCH_HOT_RANK_TOP_COLOR,
} from '@/src/features/square/constants';

const PAGE_PADDING = 16;
const SECTION_GAP = 20;
const CHIP_RADIUS = 16;
const RANK_WIDTH = 28;

export const searchDiscoverStyles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: PAGE_SURFACE_COLOR,
  },
  content: {
    padding: PAGE_PADDING,
    paddingBottom: SECTION_GAP,
  },
  section: {
    marginBottom: SECTION_GAP,
  },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heading: {
    fontSize: 16,
    fontWeight: '700',
    color: APP_TEXT_COLOR,
  },
  clear: {
    fontSize: 13,
    color: MUTED_TEXT_COLOR,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
  },
  chip: {
    maxWidth: '100%',
    marginRight: 8,
    marginBottom: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: CHIP_RADIUS,
    backgroundColor: SEARCH_BAR_BG,
  },
  chipText: {
    fontSize: 13,
    color: APP_TEXT_COLOR,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  rank: {
    width: RANK_WIDTH,
    fontSize: 15,
    fontWeight: '700',
    color: SEARCH_HOT_RANK_COLOR,
  },
  rankTop: {
    color: SEARCH_HOT_RANK_TOP_COLOR,
  },
  title: {
    flex: 1,
    fontSize: 15,
    color: APP_TEXT_COLOR,
  },
  status: {
    paddingVertical: 24,
    textAlign: 'center',
    color: MUTED_TEXT_COLOR,
    fontSize: 14,
  },
});
