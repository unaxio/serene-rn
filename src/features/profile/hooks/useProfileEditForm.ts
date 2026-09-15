import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';

import type { UserGender } from '@/src/features/auth/types';
import { updateMeProfile, uploadAvatar } from '@/src/features/profile/api';
import { PROFILE_QUERY_KEYS } from '@/src/features/profile/constants';
import { useProfileHomeData } from '@/src/features/profile/hooks/useProfileHomeData';
import {
  formatBirthdayInput,
  getConstellationFromBirthday,
  toBirthdayPayload,
} from '@/src/features/profile/utils/displayProfile';
import { pickSquareImage } from '@/src/features/square/utils/pickSquareImage';
import { useAuthStore } from '@/src/store/authStore';
import { resolveCdnUrl } from '@/src/utils/cdn';
import { toastCaughtFailure } from '@/src/utils/requestError';
import { showErrorToast, showToast } from '@/src/utils/toast';

export function useProfileEditForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const { home } = useProfileHomeData(Boolean(user?.id));
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [avatarPath, setAvatarPath] = useState<string | undefined>();
  const [avatarPreview, setAvatarPreview] = useState('');
  const [nickName, setNickName] = useState(user?.nickName ?? '');
  const [bio, setBio] = useState('');
  const [gender, setGender] = useState<UserGender>(user?.gender ?? 'secret');
  const [birthday, setBirthday] = useState(
    formatBirthdayInput(user?.birthday) || '2000-01-01',
  );
  const [region, setRegion] = useState('');
  const [relationshipStatus, setRelationshipStatus] = useState('');

  useEffect(() => {
    const profile = home?.profile;
    setNickName(profile?.nickName ?? user?.nickName ?? '');
    setBio(profile?.bio ?? user?.bio ?? '');
    setGender(profile?.gender ?? user?.gender ?? 'secret');
    setBirthday(
      formatBirthdayInput(profile?.birthday ?? user?.birthday) || '2000-01-01',
    );
    setRegion(profile?.region ?? user?.region ?? '');
    setRelationshipStatus(
      profile?.relationshipStatus ?? user?.relationshipStatus ?? '',
    );
    setAvatarPreview(profile?.avatarUrl ?? user?.avatarUrl ?? '');
  }, [home?.profile, user]);

  const constellation = useMemo(
    () => getConstellationFromBirthday(toBirthdayPayload(birthday)),
    [birthday],
  );

  const handlePickAvatar = useCallback(async () => {
    const file = await pickSquareImage();
    if (!file) {
      return;
    }
    setUploading(true);
    try {
      const result = await uploadAvatar(file);
      setAvatarPath(result.relativePath);
      setAvatarPreview(resolveCdnUrl(result.relativePath) ?? file.uri);
    } catch (error) {
      toastCaughtFailure(error);
    } finally {
      setUploading(false);
    }
  }, []);

  const handleSave = useCallback(async () => {
    const trimmed = nickName.trim();
    if (!trimmed) {
      showErrorToast('请输入昵称');
      return;
    }
    setSaving(true);
    try {
      await updateMeProfile({
        nickName: trimmed,
        gender,
        birthday: toBirthdayPayload(birthday) || '20000101',
        bio: bio.trim(),
        avatarPath,
        region: region.trim() || null,
        relationshipStatus: relationshipStatus || null,
      });
      useAuthStore.setState((state) => ({
        user: state.user
          ? {
              ...state.user,
              nickName: trimmed,
              gender,
              birthday: toBirthdayPayload(birthday) || state.user.birthday,
              bio: bio.trim(),
              avatarUrl: avatarPreview || state.user.avatarUrl,
              region: region.trim() || null,
              relationshipStatus: relationshipStatus || null,
            }
          : null,
      }));
      await queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEYS.home });
      showToast('资料已更新');
      router.back();
    } catch (error) {
      toastCaughtFailure(error);
    } finally {
      setSaving(false);
    }
  }, [
    avatarPath,
    avatarPreview,
    bio,
    birthday,
    gender,
    nickName,
    queryClient,
    region,
    relationshipStatus,
    router,
  ]);

  return {
    saving,
    uploading,
    avatarPreview,
    nickName,
    setNickName,
    bio,
    setBio,
    gender,
    setGender,
    birthday,
    setBirthday,
    region,
    setRegion,
    relationshipStatus,
    setRelationshipStatus,
    constellation,
    handlePickAvatar,
    handleSave,
  };
}
