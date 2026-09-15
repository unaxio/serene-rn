import { Pressable, StyleSheet, Text, View } from 'react-native';

import { APP_TEXT_COLOR } from '@/constants/Colors';
import type { AccountDevice } from '@/src/features/profile/types';
import { PROFILE_MUTED } from '@/src/features/profile/constants';
import { formatRelativeTime } from '@/src/features/square/utils/formatRelativeTime';

interface ProfileAccountDevicesProps {
  devices: AccountDevice[];
  removing: boolean;
  onRemove: (deviceId: string) => void;
}

export function ProfileAccountDevices({
  devices,
  removing,
  onRemove,
}: ProfileAccountDevicesProps) {
  if (devices.length === 0) {
    return <Text style={styles.empty}>暂无设备记录</Text>;
  }
  return (
    <>
      {devices.map((device) => (
        <View key={device.id} style={styles.device}>
          <View style={styles.meta}>
            <Text style={styles.name}>
              {device.name}
              {device.isCurrent ? '（当前）' : ''}
            </Text>
            <Text style={styles.time}>{formatRelativeTime(device.lastActiveAt)}</Text>
          </View>
          {!device.isCurrent ? (
            <Pressable
              style={styles.offline}
              disabled={removing}
              onPress={() => onRemove(device.id)}>
              <Text style={styles.offlineText}>下线</Text>
            </Pressable>
          ) : null}
        </View>
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  device: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    gap: 12,
  },
  meta: { flex: 1, gap: 2 },
  name: { fontSize: 14, fontWeight: '600', color: APP_TEXT_COLOR },
  time: { fontSize: 12, color: PROFILE_MUTED },
  offline: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: '#E2E8F0',
  },
  offlineText: { fontSize: 13, fontWeight: '600', color: APP_TEXT_COLOR },
  empty: { fontSize: 13, color: PROFILE_MUTED },
});
