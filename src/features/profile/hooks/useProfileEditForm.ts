import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import type { UserGender } from '@/src/features/auth/types';
import { updateMeProfile, uploadAvatar } from '@/src/features/profile/api';
import { PROFILE_QUERY_KEYS } from '@/src/features/profile/constants';
import { useProfileHomeData } from '@/src/features/profile/hooks/useProfileHomeData';
import type { RegionSelection } from '@/src/features/profile/regionTypes';
import { formatProfileCityLabel } from '@/src/features/profile/utils/regionPath';
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
  const [cityCode, setCityCode] = useState<string | null>(null);
  const [regionLabel, setRegionLabel] = useState('');
  const [cityDirty, setCityDirty] = useState(false);
  const cityDirtyRef = useRef(false);
  const [relationshipStatus, setRelationshipStatus] = useState('');

  useEffect(() => {
    const profile = home?.profile;
    setNickName(profile?.nickName ?? user?.nickName ?? '');
    setBio(profile?.bio ?? user?.bio ?? '');
    setGender(profile?.gender ?? user?.gender ?? 'secret');
    setBirthday(
      formatBirthdayInput(profile?.birthday ?? user?.birthday) || '2000-01-01',
    );
    if (!cityDirtyRef.current) {
      const nextCityCode = profile?.cityCode?.trim() ?? '';
      setCityCode(nextCityCode.length > 0 ? nextCityCode : null);
      setRegionLabel(formatProfileCityLabel(profile?.city, profile?.region ?? user?.region));
      setCityDirty(false);
    }
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
        relationshipStatus: relationshipStatus || null,
        ...(cityDirty ? { cityCode } : {}),
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
              region: cityDirty ? regionLabel.trim() || null : state.user.region,
              cityCode: cityDirty ? cityCode : state.user.cityCode,
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
    cityCode,
    cityDirty,
    nickName,
    queryClient,
    regionLabel,
    relationshipStatus,
    router,
  ]);

  const handleCityChange = useCallback((selection: RegionSelection | null) => {
    cityDirtyRef.current = true;
    setCityDirty(true);
    if (!selection) {
      setCityCode(null);
      setRegionLabel('');
      return;
    }
    setCityCode(selection.cityCode);
    setRegionLabel(selection.label);
  }, []);

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
    regionLabel,
    handleCityChange,
    relationshipStatus,
    setRelationshipStatus,
    constellation,
    handlePickAvatar,
    handleSave,
  };
}
