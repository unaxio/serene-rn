import { StyleSheet, Text, View } from 'react-native';

import { APP_TEXT_COLOR } from '@/src/features/soulFlower/constants';

interface LightCardBannerProps {
  remainingCount: number;
  monthUsedCount: number;
}

const BANNER_BG = '#FFF8F0';
const BANNER_BORDER = '#FFE0B8';
const ACCENT = '#F89D34';

export function LightCardBanner({
  remainingCount,
  monthUsedCount,
}: LightCardBannerProps) {
  return (
    <View style={styles.banner}>
      <Text style={styles.title}>续光卡</Text>
      <View style={styles.row}>
        <Text style={styles.label}>
          剩余 <Text style={styles.value}>{remainingCount}</Text> 张
        </Text>
        <Text style={styles.divider}>·</Text>
        <Text style={styles.label}>
          本月已用 <Text style={styles.value}>{monthUsedCount}</Text> 次
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    marginTop: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: BANNER_BG,
    borderWidth: 1,
    borderColor: BANNER_BORDER,
    gap: 4,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: ACCENT,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  label: {
    fontSize: 13,
    color: APP_TEXT_COLOR,
  },
  value: {
    fontWeight: '700',
    color: ACCENT,
  },
  divider: {
    fontSize: 13,
    color: '#CBD5E1',
  },
});
