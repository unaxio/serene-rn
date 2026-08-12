import { memo } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { APP_TEXT_COLOR } from '@/src/features/soulFlower/constants';
import type { PartnerStatusResponse } from '@/src/features/soulFlower/types';

interface PartnerStatusModalProps {
  visible: boolean;
  onClose: () => void;
  partnerStatus?: PartnerStatusResponse;
}

function PartnerStatusModalComponent({
  visible,
  onClose,
  partnerStatus,
}: PartnerStatusModalProps) {
  const info = partnerStatus?.partnerInfo;
  const displayName = info?.nickName || info?.username || info?.userId || '伙伴';

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <Text style={styles.title}>双人联盟</Text>
          <Text style={styles.row}>伙伴：{displayName}</Text>
          <Text style={styles.row}>
            伙伴今日觉察：{info?.todayAnswered ? '已完成' : '未完成'}
          </Text>
          <Text style={styles.row}>伙伴连续觉察：{info?.streakCount ?? 0} 天</Text>
          <Text style={styles.row}>
            携手打卡：{partnerStatus?.partnerStreakCount ?? 0} 天
          </Text>
          <Text style={styles.row}>
            我今日觉察：{partnerStatus?.myTodayAnswered ? '已完成' : '未完成'}
          </Text>
          <Pressable style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>关闭</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

export const PartnerStatusModal = memo(PartnerStatusModalComponent);

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15,23,42,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  sheet: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    gap: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: APP_TEXT_COLOR,
    marginBottom: 4,
  },
  row: {
    fontSize: 15,
    color: '#334155',
  },
  button: {
    marginTop: 12,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#2F95DC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
