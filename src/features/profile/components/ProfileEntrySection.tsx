import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { APP_TEXT_COLOR } from '@/constants/Colors';
import {
  PROFILE_ACCENT,
  PROFILE_MUTED,
  PROFILE_SURFACE,
} from '@/src/features/profile/constants';
import type { RecentReceivedFlower } from '@/src/features/profile/types';
import { resolveCdnUrl } from '@/src/utils/cdn';

interface ProfileEntrySectionProps {
  flowerCoin: number;
  recentFlowers: RecentReceivedFlower[];
  onPressMembership: () => void;
  onPressInventory: () => void;
  onPressReceivedAll: () => void;
}

const THUMB = 40;

export function ProfileEntrySection({
  flowerCoin,
  recentFlowers,
  onPressMembership,
  onPressInventory,
  onPressReceivedAll,
}: ProfileEntrySectionProps) {
  return (
    <View style={styles.wrap}>
      <Pressable style={styles.row} onPress={onPressMembership}>
        <Text style={styles.rowTitle}>会员中心</Text>
        <Text style={styles.rowAction}>查看</Text>
      </Pressable>
      <Pressable style={styles.row} onPress={onPressInventory}>
        <Text style={styles.rowTitle}>花库</Text>
        <Text style={styles.rowAction}>{flowerCoin} 花瓣</Text>
      </Pressable>
      <View style={styles.flowerBlock}>
        <View style={styles.flowerHead}>
          <Text style={styles.rowTitle}>最近收到的花</Text>
          <Pressable onPress={onPressReceivedAll} hitSlop={8}>
            <Text style={styles.link}>全部</Text>
          </Pressable>
        </View>
        {recentFlowers.length === 0 ? (
          <Text style={styles.empty}>暂无收到的花</Text>
        ) : (
          <View style={styles.thumbs}>
            {recentFlowers.slice(0, 6).map((item) => {
              const uri = resolveCdnUrl(item.giftFlowerImagePath);
              return (
                <View key={item.id} style={styles.thumb}>
                  {uri ? (
                    <Image source={{ uri }} style={styles.thumbImg} contentFit="cover" />
                  ) : (
                    <View style={[styles.thumbImg, styles.thumbFallback]} />
                  )}
                </View>
              );
            })}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: 8,
    backgroundColor: PROFILE_SURFACE,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E2E8F0',
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: APP_TEXT_COLOR,
  },
  rowAction: {
    fontSize: 13,
    color: PROFILE_MUTED,
  },
  flowerBlock: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 10,
  },
  flowerHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  link: {
    fontSize: 13,
    fontWeight: '600',
    color: PROFILE_ACCENT,
  },
  empty: {
    fontSize: 13,
    color: PROFILE_MUTED,
  },
  thumbs: {
    flexDirection: 'row',
    gap: 8,
  },
  thumb: {
    width: THUMB,
    height: THUMB,
  },
  thumbImg: {
    width: THUMB,
    height: THUMB,
    borderRadius: 8,
    backgroundColor: '#E2E8F0',
  },
  thumbFallback: {
    backgroundColor: '#CBD5E1',
  },
});
