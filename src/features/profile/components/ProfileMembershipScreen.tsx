import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { APP_TEXT_COLOR } from '@/constants/Colors';
import { getMembership } from '@/src/features/profile/api';
import {
  PROFILE_ACCENT,
  PROFILE_MUTED,
  PROFILE_PAGE_BG,
  PROFILE_QUERY_KEYS,
  PROFILE_SURFACE,
} from '@/src/features/profile/constants';
import { SquarePageHeader } from '@/src/features/square/components/SquarePageHeader';
import { formatRelativeTime } from '@/src/features/square/utils/formatRelativeTime';

export function ProfileMembershipScreen() {
  const router = useRouter();
  const query = useQuery({
    queryKey: PROFILE_QUERY_KEYS.membership,
    queryFn: getMembership,
  });

  const data = query.data;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <SquarePageHeader title="会员中心" onBack={() => router.back()} />
      {query.isLoading ? (
        <ActivityIndicator style={styles.loading} color={PROFILE_ACCENT} />
      ) : (
        <View style={styles.body}>
          <View style={styles.card}>
            <Text style={styles.status}>
              {data?.isMember ? '会员生效中' : '尚未开通会员'}
            </Text>
            <Text style={styles.meta}>等级：{data?.level ?? '—'}</Text>
            <Text style={styles.meta}>
              到期：
              {data?.expireAt ? formatRelativeTime(data.expireAt) : '—'}
            </Text>
          </View>
          <Text style={styles.section}>会员权益</Text>
          {(data?.benefits ?? []).map((benefit) => (
            <Text key={benefit} style={styles.benefit}>
              · {benefit}
            </Text>
          ))}
          {(data?.benefits?.length ?? 0) === 0 ? (
            <Text style={styles.empty}>暂无权益说明</Text>
          ) : null}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: PROFILE_PAGE_BG },
  loading: { marginTop: 40 },
  body: { paddingHorizontal: 16, gap: 10 },
  card: {
    backgroundColor: PROFILE_SURFACE,
    borderRadius: 12,
    padding: 16,
    gap: 6,
  },
  status: { fontSize: 18, fontWeight: '700', color: APP_TEXT_COLOR },
  meta: { fontSize: 14, color: PROFILE_MUTED },
  section: { fontSize: 15, fontWeight: '700', color: APP_TEXT_COLOR, marginTop: 8 },
  benefit: { fontSize: 14, color: APP_TEXT_COLOR, lineHeight: 22 },
  empty: { fontSize: 13, color: PROFILE_MUTED },
});
