import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { AwarenessAnswerModal } from '@/src/features/soulFlower/components/AwarenessAnswerModal';
import { PartnerInviteModal } from '@/src/features/soulFlower/components/PartnerInviteModal';
import { PartnerStatusModal } from '@/src/features/soulFlower/components/PartnerStatusModal';
import { StreakDetailModal } from '@/src/features/soulFlower/components/StreakDetailModal';
import { TodayResultModal } from '@/src/features/soulFlower/components/TodayResultModal';
import { usePartnerStatus } from '@/src/features/soulFlower/hooks/usePartner';
import { useTodayTask } from '@/src/features/soulFlower/hooks/useTodayTask';
import type { FlowerCardProgress } from '@/src/features/soulFlower/types';

interface TodayAwarenessCardProps {
  flowerImageUrl?: string | null;
  progress: FlowerCardProgress;
}

export function TodayAwarenessCard({
  flowerImageUrl,
  progress,
}: TodayAwarenessCardProps) {
  const { data, isLoading, isError, refetch, isSubmitting, submitAnswer } =
    useTodayTask();
  const { data: partnerStatus } = usePartnerStatus();

  const [answerVisible, setAnswerVisible] = useState(false);
  const [resultVisible, setResultVisible] = useState(false);
  const [streakVisible, setStreakVisible] = useState(false);
  const [inviteVisible, setInviteVisible] = useState(false);
  const [partnerVisible, setPartnerVisible] = useState(false);

  const alreadyAnswered = data?.alreadyAnswered === true;
  const hasTask = data?.hasTask === true && Boolean(data.question);
  const myStreakCount = partnerStatus?.myStreakCount ?? 0;
  const partnerStreakCount = partnerStatus?.partnerStreakCount ?? 0;
  const hasPartner = partnerStatus?.hasPartner === true;

  const handlePrimary = useCallback(() => {
    if (alreadyAnswered) {
      setResultVisible(true);
      return;
    }
    if (hasTask) {
      setAnswerVisible(true);
    }
  }, [alreadyAnswered, hasTask]);

  const handleAlliance = useCallback(() => {
    if (hasPartner) {
      setPartnerVisible(true);
      return;
    }
    setInviteVisible(true);
  }, [hasPartner]);

  const handleSubmit = useCallback(
    async (answerContent: string) => {
      if (!data?.question) {
        return false;
      }
      return submitAnswer(data.question.id, answerContent);
    },
    [data?.question, submitAnswer],
  );

  if (isLoading) {
    return (
      <View style={styles.card}>
        <ActivityIndicator color="#2F95DC" />
      </View>
    );
  }

  if (isError || !data) {
    return (
      <View style={styles.card}>
        <Text style={styles.errorText}>加载失败</Text>
        <Pressable onPress={() => void refetch()}>
          <Text style={styles.retry}>重试</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <Text style={styles.title}>今日觉察</Text>
      <Text style={styles.subtitle}>给自己一个温柔的开始。</Text>

      <View style={styles.statusRow}>
        <Text style={styles.statusIcon}>{alreadyAnswered ? '✓' : '○'}</Text>
        <Text style={styles.statusText}>
          今日任务：{alreadyAnswered ? '已完成' : '未完成'}
        </Text>
      </View>

      <Pressable
        style={[styles.primaryButton, !alreadyAnswered && !hasTask && styles.disabled]}
        onPress={handlePrimary}
        disabled={!alreadyAnswered && !hasTask}>
        <Text style={styles.primaryText}>
          {alreadyAnswered ? '查看今日结果' : '开始今日觉察'}
        </Text>
      </Pressable>

      <Text style={styles.hint}>
        {alreadyAnswered
          ? '下次觉察：明日 00:00，继续看见自己'
          : '完成今日觉察，更新花卡成长状态'}
      </Text>

      <Pressable style={styles.linkRow} onPress={() => setStreakVisible(true)}>
        <Text style={styles.linkText}>🔥 连续觉察 第 {myStreakCount} 天 ›</Text>
      </Pressable>

      <Pressable style={styles.linkRow} onPress={handleAlliance}>
        <Text style={styles.linkText}>
          {hasPartner
            ? `👥 双人联盟 携手 ${partnerStreakCount} 天 ›`
            : '👥 双人联盟 邀请伙伴 ›'}
        </Text>
      </Pressable>

      <AwarenessAnswerModal
        visible={answerVisible}
        question={data.question}
        isSubmitting={isSubmitting}
        onClose={() => setAnswerVisible(false)}
        onSubmit={handleSubmit}
      />
      <TodayResultModal
        visible={resultVisible}
        onClose={() => setResultVisible(false)}
        flowerImageUrl={flowerImageUrl}
        partnerStatus={partnerStatus}
        progress={progress}
      />
      <StreakDetailModal
        visible={streakVisible}
        onClose={() => setStreakVisible(false)}
        partnerStatus={partnerStatus}
      />
      <PartnerInviteModal
        visible={inviteVisible}
        onClose={() => setInviteVisible(false)}
      />
      <PartnerStatusModal
        visible={partnerVisible}
        onClose={() => setPartnerVisible(false)}
        partnerStatus={partnerStatus}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 8,
    minHeight: 280,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  subtitle: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 2,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusIcon: {
    fontSize: 13,
    color: '#22C55E',
  },
  statusText: {
    fontSize: 12,
    color: '#334155',
    fontWeight: '500',
  },
  primaryButton: {
    marginTop: 4,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#2F95DC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
  primaryText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  hint: {
    fontSize: 11,
    color: '#94A3B8',
    lineHeight: 16,
  },
  linkRow: {
    paddingVertical: 2,
  },
  linkText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '500',
  },
  errorText: {
    fontSize: 13,
    color: '#B91C1C',
  },
  retry: {
    fontSize: 13,
    color: '#2F95DC',
    fontWeight: '600',
  },
});
