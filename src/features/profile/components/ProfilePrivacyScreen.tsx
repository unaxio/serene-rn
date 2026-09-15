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
import { getPrivacySettings, putPrivacySettings } from '@/src/features/profile/api';
import {
  PROFILE_ACCENT,
  PROFILE_MUTED,
  PROFILE_PAGE_BG,
  PROFILE_QUERY_KEYS,
} from '@/src/features/profile/constants';
import type { PrivacySettings } from '@/src/features/profile/types';
import { SquarePageHeader } from '@/src/features/square/components/SquarePageHeader';
import { toastCaughtFailure } from '@/src/utils/requestError';
import { showToast } from '@/src/utils/toast';

const DEFAULT_SETTINGS: PrivacySettings = {
  profileVisibility: 'public',
  feedVisibility: 'public',
  messagePermission: 'everyone',
  showOnlineStatus: true,
  personalizedRecommend: true,
  personalizedService: true,
};

type BoolKey = 'showOnlineStatus' | 'personalizedRecommend' | 'personalizedService';

const BOOL_ROWS: Array<{ key: BoolKey; label: string }> = [
  { key: 'showOnlineStatus', label: '显示在线状态' },
  { key: 'personalizedRecommend', label: '个性化推荐' },
  { key: 'personalizedService', label: '个性化服务' },
];

export function ProfilePrivacyScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [draft, setDraft] = useState<PrivacySettings>(DEFAULT_SETTINGS);

  const query = useQuery({
    queryKey: PROFILE_QUERY_KEYS.privacy,
    queryFn: getPrivacySettings,
  });

  useEffect(() => {
    if (query.data) {
      setDraft(query.data);
    }
  }, [query.data]);

  const mutation = useMutation({
    mutationFn: putPrivacySettings,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEYS.privacy });
      showToast('隐私设置已保存');
    },
    onError: toastCaughtFailure,
  });

  const toggle = useCallback((key: BoolKey, value: boolean) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleSave = useCallback(() => {
    void mutation.mutateAsync(draft);
  }, [draft, mutation]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <SquarePageHeader title="隐私设置" onBack={() => router.back()} />
      {query.isLoading ? (
        <ActivityIndicator style={styles.loading} color={PROFILE_ACCENT} />
      ) : (
        <View style={styles.body}>
          <View style={styles.card}>
            <Text style={styles.hint}>资料可见：{draft.profileVisibility}</Text>
            <Text style={styles.hint}>动态可见：{draft.feedVisibility}</Text>
            <Text style={styles.hint}>私信权限：{draft.messagePermission}</Text>
          </View>
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
          </View>
          <Pressable
            style={[styles.save, mutation.isPending && styles.saveDisabled]}
            disabled={mutation.isPending}
            onPress={handleSave}>
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
  hint: { fontSize: 14, color: PROFILE_MUTED },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  label: { fontSize: 15, color: APP_TEXT_COLOR },
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
