import { Image } from 'expo-image';
import { SymbolView } from 'expo-symbols';
import { memo, useCallback } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { FlowerImage } from '@/src/features/soulFlower/components/FlowerImage';
import { APP_TEXT_COLOR } from '@/src/features/soulFlower/constants';
import type { FlowerCardProgress, PartnerStatusResponse } from '@/src/features/soulFlower/types';
import { formatProgressLabel } from '@/src/features/soulFlower/utils/progress';
import { showToast } from '@/src/utils/toast';

interface TodayResultModalProps {
  visible: boolean;
  onClose: () => void;
  flowerImagePath?: string | null;
  partnerStatus?: PartnerStatusResponse;
  progress: FlowerCardProgress;
}

const RAINBOW_PROGRESS_IMAGE = require('../../../../assets/images/rainbow-progress.png');
const STAT_VALUE_ROW_HEIGHT = 36;
const RAINBOW_IMAGE_SIZE = 36;
const BACKDROP_COLOR = 'rgba(0, 0, 0, 0.55)';

function StatValueWithUnit({
  value,
  valueColor,
}: {
  value: number;
  valueColor: string;
}) {
  return (
    <View style={styles.statValueRow}>
      <Text style={[styles.statNumber, { color: valueColor }]}>{value}</Text>
      <Text style={styles.statUnit}>天</Text>
    </View>
  );
}

function TodayResultModalComponent({
  visible,
  onClose,
  flowerImagePath,
  partnerStatus,
  progress,
}: TodayResultModalProps) {
  const myStreakCount = partnerStatus?.myStreakCount ?? 0;
  const partnerStreakCount = partnerStatus?.partnerStreakCount ?? 0;
  const hasPartner = partnerStatus?.hasPartner === true;
  const partnerNotDone =
    hasPartner && partnerStatus?.partnerInfo?.todayAnswered === false;
  const progressLabel = formatProgressLabel(
    progress.completedCount,
    progress.totalCount || 6,
  );

  const handleRemind = useCallback(() => {
    showToast('提醒功能即将上线');
  }, []);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>今日觉察已完成</Text>
            <Pressable onPress={onClose} hitSlop={12} style={styles.closeButton}>
              <SymbolView
                name={{
                  ios: 'xmark',
                  android: 'close',
                  web: 'close',
                }}
                size={18}
                tintColor={APP_TEXT_COLOR}
              />
            </Pressable>
          </View>

          <View style={styles.body}>
            <FlowerImage imagePath={flowerImagePath} size={180} />

            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <StatValueWithUnit value={myStreakCount} valueColor="#EF4444" />
                <Text style={styles.statLabel}>连续觉察</Text>
              </View>

              <View style={styles.statItem}>
                <StatValueWithUnit value={partnerStreakCount} valueColor="#3B82F6" />
                <Text style={styles.statLabel}>伙伴联盟</Text>
              </View>

              <View style={styles.statItem}>
                <View style={styles.statValueRow}>
                  <Image
                    source={RAINBOW_PROGRESS_IMAGE}
                    style={styles.rainbowImage}
                    contentFit="contain"
                  />
                </View>
                <Text style={styles.statLabel}>{progressLabel}</Text>
              </View>
            </View>
          </View>

          {partnerNotDone ? (
            <View style={styles.footer}>
              <Text style={styles.footerHint}>伙伴今日还未完成</Text>
              <Pressable style={styles.remindButton} onPress={handleRemind}>
                <Text style={styles.remindText}>提醒一下</Text>
              </Pressable>
            </View>
          ) : null}
        </View>
      </View>
    </Modal>
  );
}

export const TodayResultModal = memo(TodayResultModalComponent);

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: BACKDROP_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  sheet: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    position: 'relative',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: APP_TEXT_COLOR,
  },
  closeButton: {
    position: 'absolute',
    right: 14,
    top: 14,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
    gap: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  statValueRow: {
    height: STAT_VALUE_ROW_HEIGHT,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 32,
  },
  statUnit: {
    fontSize: 13,
    color: '#64748B',
    marginLeft: 2,
    marginBottom: 4,
  },
  rainbowImage: {
    width: RAINBOW_IMAGE_SIZE,
    height: RAINBOW_IMAGE_SIZE,
  },
  statLabel: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E2E8F0',
  },
  footerHint: {
    fontSize: 13,
    color: '#94A3B8',
    flex: 1,
    marginRight: 12,
  },
  remindButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#DBEAFE',
  },
  remindText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2563EB',
  },
});
