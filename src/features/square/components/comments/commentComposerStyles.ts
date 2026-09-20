import { StyleSheet } from 'react-native';

import { APP_TEXT_COLOR } from '@/constants/Colors';
import { ACCENT_COLOR } from '@/src/features/square/constants';

const INPUT_HEIGHT = 40;
const INPUT_FONT_SIZE = 14;
const INPUT_LINE_HEIGHT = 20;
const INPUT_PADDING_H = 14;

export const commentComposerStyles = StyleSheet.create({
  wrap: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E8E6F2',
    backgroundColor: '#FFFFFF',
    paddingTop: 8,
  },
  inlineWrap: {
    paddingTop: 6,
    borderTopWidth: 0,
    backgroundColor: 'transparent',
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
  },
  inputWrap: {
    flex: 1,
    height: INPUT_HEIGHT,
    justifyContent: 'center',
  },
  input: {
    height: INPUT_HEIGHT,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: INPUT_PADDING_H,
    fontSize: INPUT_FONT_SIZE,
    lineHeight: INPUT_LINE_HEIGHT,
    color: APP_TEXT_COLOR,
  },
  inlineInput: {
    height: 34,
    fontSize: 13,
  },
  inputHidden: {
    color: 'transparent',
  },
  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: INPUT_HEIGHT,
    justifyContent: 'center',
    paddingHorizontal: INPUT_PADDING_H,
  },
  overlayText: {
    fontSize: INPUT_FONT_SIZE,
    lineHeight: INPUT_LINE_HEIGHT,
    color: APP_TEXT_COLOR,
  },
  send: {
    height: 36,
    paddingHorizontal: 14,
    borderRadius: 18,
    backgroundColor: ACCENT_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendDisabled: {
    opacity: 0.45,
  },
  sendText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
