import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { PROFILE_ACCENT } from '@/src/features/profile/constants';

interface ProfileEditAvatarFieldProps {
  uri: string;
  uploading: boolean;
  onPress: () => void;
}

const AVATAR_SIZE = 72;

export function ProfileEditAvatarField({
  uri,
  uploading,
  onPress,
}: ProfileEditAvatarFieldProps) {
  return (
    <Pressable style={styles.wrap} onPress={onPress}>
      {uri ? (
        <Image source={{ uri }} style={styles.avatar} contentFit="cover" />
      ) : (
        <View style={[styles.avatar, styles.fallback]} />
      )}
      <Text style={styles.hint}>{uploading ? '上传中…' : '更换头像'}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', gap: 8, marginVertical: 8 },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: '#E2E8F0',
  },
  fallback: { backgroundColor: '#CBD5E1' },
  hint: { fontSize: 13, color: PROFILE_ACCENT, fontWeight: '600' },
});
