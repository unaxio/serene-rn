import { useMutation, useQuery } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { APP_TEXT_COLOR } from '@/constants/Colors';
import { createPromoteOrder, getPromotePlans } from '@/src/features/profile/api';
import {
  PROFILE_ACCENT,
  PROFILE_MUTED,
  PROFILE_PAGE_BG,
  PROFILE_QUERY_KEYS,
} from '@/src/features/profile/constants';
import type { PromoteOrderPayload, PromotePlan } from '@/src/features/profile/types';
import { SquarePageHeader } from '@/src/features/square/components/SquarePageHeader';
import { toastCaughtFailure } from '@/src/utils/requestError';
import { showErrorToast, showToast } from '@/src/utils/toast';

const PROMOTE_TARGET_TYPES = ['story', 'share', 'ask'] as const;

type PromoteTargetType = (typeof PROMOTE_TARGET_TYPES)[number];

function isPromoteTargetType(value: string): value is PromoteTargetType {
  return (PROMOTE_TARGET_TYPES as readonly string[]).includes(value);
}

function firstParam(value: string | string[] | undefined): string {
  if (Array.isArray(value)) {
    return value[0] ?? '';
  }
  return value ?? '';
}

export function ProfilePromoteScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ targetType?: string; targetId?: string }>();
  const targetTypeRaw = firstParam(params.targetType);
  const targetId = firstParam(params.targetId);
  const targetType = isPromoteTargetType(targetTypeRaw) ? targetTypeRaw : null;
  const hasTarget = Boolean(targetType && targetId);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  const plansQuery = useQuery({
    queryKey: PROFILE_QUERY_KEYS.promotePlans,
    queryFn: getPromotePlans,
  });

  const mutation = useMutation({
    mutationFn: createPromoteOrder,
    onSuccess: (result) => {
      showToast(`推广成功，剩余花瓣 ${result.flowerCoinBalance}`);
      router.back();
    },
    onError: toastCaughtFailure,
  });

  const selectedPlan = useMemo(
    () => (plansQuery.data ?? []).find((plan) => plan.id === selectedPlanId) ?? null,
    [plansQuery.data, selectedPlanId],
  );

  const handleSubmit = useCallback(() => {
    if (!hasTarget || !targetType) {
      showErrorToast('请先选择要推广的内容');
      return;
    }
    if (!selectedPlan) {
      showErrorToast('请选择推广方案');
      return;
    }
    const payload: PromoteOrderPayload = {
      targetType,
      targetId,
      planId: selectedPlan.id,
    };
    void mutation.mutateAsync(payload);
  }, [hasTarget, mutation, selectedPlan, targetId, targetType]);

  return (
    <SafeAreaView style={styles.safe} edges={[]}>
      <SquarePageHeader title="内容推广" onBack={() => router.back()} />
      <View style={styles.body}>
        {!hasTarget ? (
          <Text style={styles.tip}>请从内容详情进入推广，或携带 targetType / targetId</Text>
        ) : (
          <Text style={styles.tip}>
            推广目标：{targetType} · {targetId}
          </Text>
        )}
        {plansQuery.isLoading ? (
          <ActivityIndicator style={styles.loading} color={PROFILE_ACCENT} />
        ) : (
          (plansQuery.data ?? []).map((plan: PromotePlan) => {
            const selected = plan.id === selectedPlanId;
            return (
              <Pressable
                key={plan.id}
                style={[styles.plan, selected && styles.planSelected]}
                onPress={() => setSelectedPlanId(plan.id)}>
                <Text style={styles.planName}>{plan.name}</Text>
                <Text style={styles.planMeta}>
                  {plan.durationHours} 小时 · 约 +{plan.expectedExtraViews} 阅读
                </Text>
                <Text style={styles.planCost}>{plan.flowerCoinCost} 花瓣</Text>
              </Pressable>
            );
          })
        )}
        {!plansQuery.isLoading && (plansQuery.data?.length ?? 0) === 0 ? (
          <Text style={styles.empty}>暂无推广方案</Text>
        ) : null}
        <Pressable
          style={[styles.submit, (!hasTarget || mutation.isPending) && styles.submitDisabled]}
          disabled={!hasTarget || mutation.isPending}
          onPress={handleSubmit}>
          <Text style={styles.submitText}>提交推广</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: PROFILE_PAGE_BG },
  body: { paddingHorizontal: 16, gap: 10 },
  tip: { fontSize: 13, color: PROFILE_MUTED, marginBottom: 4 },
  loading: { marginTop: 24 },
  plan: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    gap: 4,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  planSelected: { borderColor: PROFILE_ACCENT },
  planName: { fontSize: 16, fontWeight: '700', color: APP_TEXT_COLOR },
  planMeta: { fontSize: 13, color: PROFILE_MUTED },
  planCost: { fontSize: 14, fontWeight: '600', color: PROFILE_ACCENT },
  empty: { fontSize: 13, color: PROFILE_MUTED, textAlign: 'center', marginTop: 20 },
  submit: {
    marginTop: 12,
    height: 48,
    borderRadius: 24,
    backgroundColor: PROFILE_ACCENT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitDisabled: { opacity: 0.5 },
  submitText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
});
