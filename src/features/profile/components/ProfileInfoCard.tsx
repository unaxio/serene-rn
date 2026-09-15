import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { APP_TEXT_COLOR } from '@/constants/Colors';
import { PROFILE_MUTED, PROFILE_SURFACE } from '@/src/features/profile/constants';
import type { ProfileDetail } from '@/src/features/profile/types';
import {
  calcAgeFromBirthday,
  formatGenderLabel,
} from '@/src/features/profile/utils/displayProfile';

interface ProfileInfoCardProps {
  profile: ProfileDetail;
  onPressEdit?: () => void;
}

const AVATAR_SIZE = 64;

export function ProfileInfoCard({ profile, onPressEdit }: ProfileInfoCardProps) {
  const age = calcAgeFromBirthday(profile.birthday);
  const metaParts = [
    formatGenderLabel(profile.gender),
    age !== null ? `${age}岁` : null,
    profile.ipLocation,
  ].filter((part): part is string => Boolean(part));

  const body = (
    <>
      <View style={styles.row}>
        {profile.avatarUrl ? (
          <Image source={{ uri: profile.avatarUrl }} style={styles.avatar} contentFit="cover" />
        ) : (
          <View style={[styles.avatar, styles.avatarFallback]} />
        )}
        <View style={styles.meta}>
          <View style={styles.nameRow}>
            <Text style={styles.name} numberOfLines={1}>
              {profile.nickName}
            </Text>
            {profile.level != null && String(profile.level).length > 0 ? (
              <Text style={styles.level}>Lv.{profile.level}</Text>
            ) : null}
          </View>
          {profile.identityTags.length > 0 ? (
            <Text style={styles.tags} numberOfLines={1}>
              {profile.identityTags.join(' · ')}
            </Text>
          ) : null}
          <Text style={styles.sub} numberOfLines={1}>
            {metaParts.join(' · ') || (onPressEdit ? '完善资料' : ' ')}
          </Text>
        </View>
        {onPressEdit ? <Text style={styles.edit}>编辑</Text> : null}
      </View>
      {profile.bio.trim().length > 0 ? (
        <Text style={styles.bio} numberOfLines={2}>
          {profile.bio}
        </Text>
      ) : onPressEdit ? (
        <Text style={styles.bioPlaceholder}>点击完善个性签名</Text>
      ) : null}
    </>
  );

  if (onPressEdit) {
    return (
      <Pressable style={styles.card} onPress={onPressEdit}>
        {body}
      </Pressable>
    );
  }
  return <View style={styles.card}>{body}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: PROFILE_SURFACE,
    paddingHorizontal: 16,
    paddingBottom: 14,
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: '#E2E8F0',
  },
  avatarFallback: {
    backgroundColor: '#CBD5E1',
  },
  meta: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  name: {
    flexShrink: 1,
    fontSize: 18,
    fontWeight: '700',
    color: APP_TEXT_COLOR,
  },
  level: {
    fontSize: 12,
    fontWeight: '600',
    color: PROFILE_MUTED,
  },
  tags: {
    fontSize: 12,
    color: PROFILE_MUTED,
  },
  sub: {
    fontSize: 12,
    color: PROFILE_MUTED,
  },
  edit: {
    fontSize: 13,
    fontWeight: '600',
    color: PROFILE_MUTED,
  },
  bio: {
    fontSize: 14,
    lineHeight: 20,
    color: APP_TEXT_COLOR,
  },
  bioPlaceholder: {
    fontSize: 14,
    color: PROFILE_MUTED,
  },
});
