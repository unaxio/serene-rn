import type { ComponentType } from 'react';
import { Platform, Switch, type SwitchProps } from 'react-native';

import { ACCENT_COLOR } from '@/src/features/square/constants';

const SWITCH_THUMB_COLOR = '#FFFFFF';
const SWITCH_TRACK_OFF = '#E2E8F0';

type WebSwitchProps = SwitchProps & {
  activeThumbColor?: string;
};

type AppSwitchProps = Omit<SwitchProps, 'trackColor' | 'thumbColor'> & {
  /** 开启时轨道色，默认项目强调色 */
  activeTrackColor?: string;
};

const WebAwareSwitch = Switch as unknown as ComponentType<WebSwitchProps>;

/**
 * Web 开启态圆钮色走 activeThumbColor（默认 #009688 / rgb(0,150,136)），
 * 仅设 thumbColor 在 Web 打开态不生效。
 */
export function AppSwitch({
  activeTrackColor = ACCENT_COLOR,
  ...props
}: AppSwitchProps) {
  return (
    <WebAwareSwitch
      {...props}
      trackColor={{ false: SWITCH_TRACK_OFF, true: activeTrackColor }}
      thumbColor={SWITCH_THUMB_COLOR}
      activeThumbColor={Platform.OS === 'web' ? SWITCH_THUMB_COLOR : undefined}
    />
  );
}
