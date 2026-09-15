import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { APP_TEXT_COLOR } from '@/constants/Colors';
import { ConfirmDangerModal } from '@/src/features/square/components/ConfirmDangerModal';
import { SquarePageHeader } from '@/src/features/square/components/SquarePageHeader';
import { PROFILE_MUTED, PROFILE_PAGE_BG } from '@/src/features/profile/constants';
import { useAuthStore } from '@/src/store/authStore';

interface SettingRowProps {
  label: string;
  onPress: () => void;
}

function SettingRow({ label, onPress }: SettingRowProps) {
  return (
    <Pressable style={styles.row} onPress={onPress}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.chevron}>›</Text>
    </Pressable>
  );
}

export function ProfileSettingsScreen() {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = useCallback(async () => {
    setLoggingOut(true);
    try {
      await logout();
      setConfirmVisible(false);
      router.replace('/(tabs)/profile');
    } finally {
      setLoggingOut(false);
    }
  }, [logout, router]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <SquarePageHeader title="设置与服务" onBack={() => router.back()} />
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>账号与隐私</Text>
        <SettingRow label="账号与安全" onPress={() => router.push('/profile/settings/account')} />
        <SettingRow label="隐私设置" onPress={() => router.push('/profile/settings/privacy')} />
        <SettingRow
          label="通知设置"
          onPress={() => router.push('/profile/settings/notifications')}
        />
        <SettingRow label="黑名单" onPress={() => router.push('/profile/settings/blacklist')} />
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>帮助与其他</Text>
        <SettingRow label="帮助与反馈" onPress={() => router.push('/profile/settings/help')} />
        <SettingRow label="关于我们" onPress={() => router.push('/profile/settings/about')} />
      </View>
      <Pressable style={styles.logout} onPress={() => setConfirmVisible(true)}>
        <Text style={styles.logoutText}>退出登录</Text>
      </Pressable>
      <ConfirmDangerModal
        visible={confirmVisible}
        title="确认退出？"
        message="退出后需要重新登录才能使用完整功能"
        confirmLabel="退出登录"
        isSubmitting={loggingOut}
        onCancel={() => setConfirmVisible(false)}
        onConfirm={() => {
          void handleLogout();
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: PROFILE_PAGE_BG },
  section: {
    marginTop: 12,
    marginHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 12,
    color: PROFILE_MUTED,
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E2E8F0',
  },
  rowLabel: { fontSize: 15, color: APP_TEXT_COLOR },
  chevron: { fontSize: 20, color: PROFILE_MUTED },
  logout: {
    marginTop: 24,
    marginHorizontal: 16,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutText: { fontSize: 16, fontWeight: '600', color: '#DC2626' },
});
