import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AppSwitch } from '@/src/components/AppSwitch';
import { getSystemMute, updateSystemMute } from '@/src/features/connect/api';
import { CONNECT_QUERY_KEYS } from '@/src/features/connect/constants';
import { APP_TEXT_COLOR } from '@/constants/Colors';
import { toastCaughtFailure } from '@/src/utils/requestError';

export function SystemMuteBar() {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: CONNECT_QUERY_KEYS.systemMute,
    queryFn: getSystemMute,
  });
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    if (query.data) {
      setMuted(query.data.muted);
    }
  }, [query.data]);

  const handleChange = (next: boolean) => {
    const previous = muted;
    setMuted(next);
    void (async () => {
      try {
        await updateSystemMute(next);
        await queryClient.invalidateQueries({ queryKey: CONNECT_QUERY_KEYS.systemMute });
        await queryClient.invalidateQueries({ queryKey: CONNECT_QUERY_KEYS.home });
      } catch (error) {
        setMuted(previous);
        toastCaughtFailure(error);
      }
    })();
  };

  return (
    <View style={styles.bar}>
      <Text style={styles.label}>消息免打扰</Text>
      <AppSwitch value={muted} onValueChange={handleChange} />
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    margin: 16,
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: { fontSize: 15, color: APP_TEXT_COLOR },
});
