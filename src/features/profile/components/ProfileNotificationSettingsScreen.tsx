import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { APP_TEXT_COLOR } from '@/constants/Colors';
import {
  getNotificationSettings,
  putNotificationSettings,
} from '@/src/features/profile/api';
import {
  PROFILE_ACCENT,
  PROFILE_MUTED,
  PROFILE_PAGE_BG,
  PROFILE_QUERY_KEYS,
} from '@/src/features/profile/constants';
import type { NotificationSettings } from '@/src/features/profile/types';
import { SquarePageHeader } from '@/src/features/square/components/SquarePageHeader';
import { toastCaughtFailure } from '@/src/utils/requestError';
import { showToast } from '@/src/utils/toast';

const DEFAULT_SETTINGS: NotificationSettings = {
  system: true,
  interaction: true,
  directMessage: true,
  groupChat: true,
  quietHoursEnabled: false,
  quietHoursStart: null,
  quietHoursEnd: null,
  ringtoneId: null,
  previewMode: 'full',
};

type BoolKey =
  | 'system'
  | 'interaction'
  | 'directMessage'
  | 'groupChat'
  | 'quietHoursEnabled';

const BOOL_ROWS: Array<{ key: BoolKey; label: string }> = [
  { key: 'system', label: '系统通知' },
  { key: 'interaction', label: '互动通知' },
  { key: 'directMessage', label: '私信通知' },
  { key: 'groupChat', label: '群聊通知' },
  { key: 'quietHoursEnabled', label: '免打扰时段' },
];

export function ProfileNotificationSettingsScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [draft, setDraft] = useState<NotificationSettings>(DEFAULT_SETTINGS);

  const query = useQuery({
    queryKey: PROFILE_QUERY_KEYS.notificationSettings,
    queryFn: getNotificationSettings,
  });

  useEffect(() => {
    if (query.data) {
      setDraft(query.data);
    }
  }, [query.data]);

  const mutation = useMutation({
    mutationFn: putNotificationSettings,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: PROFILE_QUERY_KEYS.notificationSettings,
      });
      showToast('通知设置已保存');
    },
    onError: toastCaughtFailure,
  });

  const toggle = useCallback((key: BoolKey, value: boolean) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }, []);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <SquarePageHeader title="通知设置" onBack={() => router.back()} />
      {query.isLoading ? (
        <ActivityIndicator style={styles.loading} color={PROFILE_ACCENT} />
      ) : (
        <View style={styles.body}>
          <View style={styles.card}>
            {BOOL_ROWS.map((row) => (
              <View key={row.key} style={styles.switchRow}>
                <Text style={styles.label}>{row.label}</Text>
                <Switch
                  value={draft[row.key]}
                  onValueChange={(value) => toggle(row.key, value)}
                  trackColor={{ true: PROFILE_ACCENT }}
                />
              </View>
            ))}
            <Text style={styles.hint}>预览模式：{draft.previewMode}</Text>
          </View>
          <Pressable
            style={[styles.save, mutation.isPending && styles.saveDisabled]}
            disabled={mutation.isPending}
            onPress={() => {
              void mutation.mutateAsync(draft);
            }}>
            <Text style={styles.saveText}>保存</Text>
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: PROFILE_PAGE_BG },
  loading: { marginTop: 40 },
  body: { paddingHorizontal: 16, gap: 12 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    gap: 10,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  label: { fontSize: 15, color: APP_TEXT_COLOR },
  hint: { fontSize: 13, color: PROFILE_MUTED, marginTop: 4 },
  save: {
    height: 48,
    borderRadius: 24,
    backgroundColor: PROFILE_ACCENT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveDisabled: { opacity: 0.6 },
  saveText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
});
