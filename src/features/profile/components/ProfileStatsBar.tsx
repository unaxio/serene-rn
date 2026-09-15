import { Pressable, StyleSheet, Text, View } from 'react-native';

import { APP_TEXT_COLOR } from '@/constants/Colors';
import { PROFILE_MUTED, PROFILE_SURFACE } from '@/src/features/profile/constants';
import type { ProfileStats } from '@/src/features/profile/types';

interface ProfileStatsBarProps {
  stats: ProfileStats;
  onPressFollowing?: () => void;
  onPressFollowers?: () => void;
  onPressLikes?: () => void;
}

function StatCell({
  label,
  value,
  onPress,
}: {
  label: string;
  value: number;
  onPress?: () => void;
}) {
  const content = (
    <>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </>
  );
  if (onPress) {
    return (
      <Pressable style={styles.cell} onPress={onPress}>
        {content}
      </Pressable>
    );
  }
  return <View style={styles.cell}>{content}</View>;
}

export function ProfileStatsBar({
  stats,
  onPressFollowing,
  onPressFollowers,
  onPressLikes,
}: ProfileStatsBarProps) {
  return (
    <View style={styles.bar}>
      <StatCell label="关注" value={stats.followingCount} onPress={onPressFollowing} />
      <StatCell label="粉丝" value={stats.followerCount} onPress={onPressFollowers} />
      <StatCell label="获赞" value={stats.resonateReceivedCount} onPress={onPressLikes} />
      <StatCell label="收花" value={stats.flowerReceivedCount} />
      <StatCell label="送花" value={stats.flowerSentCount} />
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    backgroundColor: PROFILE_SURFACE,
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E2E8F0',
  },
  cell: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  value: {
    fontSize: 16,
    fontWeight: '700',
    color: APP_TEXT_COLOR,
  },
  label: {
    fontSize: 12,
    color: PROFILE_MUTED,
  },
});
