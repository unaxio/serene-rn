import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { APP_TEXT_COLOR } from '@/constants/Colors';
import {
  deleteAccount,
  deleteAccountDevice,
  getAccountDevices,
  getAccountSecurity,
} from '@/src/features/profile/api';
import { ProfileAccountDevices } from '@/src/features/profile/components/ProfileAccountDevices';
import {
  PROFILE_ACCENT,
  PROFILE_PAGE_BG,
  PROFILE_QUERY_KEYS,
} from '@/src/features/profile/constants';
import { ConfirmDangerModal } from '@/src/features/square/components/ConfirmDangerModal';
import { SquarePageHeader } from '@/src/features/square/components/SquarePageHeader';
import { useAuthStore } from '@/src/store/authStore';
import { toastCaughtFailure } from '@/src/utils/requestError';
import { showToast } from '@/src/utils/toast';

export function ProfileAccountScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const logout = useAuthStore((state) => state.logout);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const securityQuery = useQuery({
    queryKey: PROFILE_QUERY_KEYS.accountSecurity,
    queryFn: getAccountSecurity,
  });
  const devicesQuery = useQuery({
    queryKey: PROFILE_QUERY_KEYS.accountDevices,
    queryFn: getAccountDevices,
  });

  const removeDevice = useMutation({
    mutationFn: deleteAccountDevice,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEYS.accountDevices });
      showToast('设备已下线');
    },
    onError: toastCaughtFailure,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAccount,
    onSuccess: async () => {
      setConfirmDelete(false);
      showToast('账号已注销');
      await logout();
      router.replace('/(tabs)/profile');
    },
    onError: toastCaughtFailure,
  });

  const handleDelete = useCallback(() => {
    void deleteMutation.mutateAsync();
  }, [deleteMutation]);

  const security = securityQuery.data;
  const loading = securityQuery.isLoading || devicesQuery.isLoading;

  return (
    <SafeAreaView style={styles.safe} edges={[]}>
      <SquarePageHeader title="账号与安全" onBack={() => router.back()} />
      {loading ? (
        <ActivityIndicator style={styles.loading} color={PROFILE_ACCENT} />
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.card}>
            <Text style={styles.row}>手机：{security?.phoneMasked ?? '未绑定'}</Text>
            <Text style={styles.row}>邮箱：{security?.emailMasked ?? '未绑定'}</Text>
            <Text style={styles.row}>
              密码：{security?.hasPassword ? '已设置' : '未设置'}
            </Text>
            <Text style={styles.row}>
              第三方：{(security?.thirdPartyBindings ?? []).join('、') || '无'}
            </Text>
            {(security?.riskTips ?? []).map((tip) => (
              <Text key={tip} style={styles.tip}>
                {tip}
              </Text>
            ))}
          </View>
          <Text style={styles.section}>登录设备</Text>
          <ProfileAccountDevices
            devices={devicesQuery.data ?? []}
            removing={removeDevice.isPending}
            onRemove={(deviceId) => {
              void removeDevice.mutateAsync(deviceId);
            }}
          />
          <Pressable style={styles.danger} onPress={() => setConfirmDelete(true)}>
            <Text style={styles.dangerText}>注销账号</Text>
          </Pressable>
        </ScrollView>
      )}
      <ConfirmDangerModal
        visible={confirmDelete}
        title="确认注销账号？"
        message="注销后将无法恢复，请谨慎操作"
        confirmLabel="确认注销"
        isSubmitting={deleteMutation.isPending}
        onCancel={() => setConfirmDelete(false)}
        onConfirm={handleDelete}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: PROFILE_PAGE_BG },
  loading: { marginTop: 40 },
  content: { paddingHorizontal: 16, paddingBottom: 40, gap: 10 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 14, gap: 8 },
  row: { fontSize: 14, color: APP_TEXT_COLOR },
  tip: { fontSize: 12, color: '#DC2626' },
  section: { fontSize: 15, fontWeight: '700', color: APP_TEXT_COLOR, marginTop: 8 },
  danger: {
    marginTop: 16,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dangerText: { fontSize: 16, fontWeight: '600', color: '#DC2626' },
});
