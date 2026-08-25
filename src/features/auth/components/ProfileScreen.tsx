import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { SafeAreaView } from 'react-native-safe-area-context';

import { APP_TEXT_COLOR } from '@/constants/Colors';
import type { UserGender } from '@/src/features/auth/types';
import { useAuthStore } from '@/src/store/authStore';
import { showErrorToast } from '@/src/utils/toast';

const PLACEHOLDER_COLOR = '#999999';
const PRIMARY_COLOR = '#2f95dc';
const DEFAULT_GENDER: UserGender = 'secret';
const DEFAULT_BIRTHDAY = '200001';

export function ProfileScreen() {
  const user = useAuthStore((state) => state.user);
  const isUpdatingProfile = useAuthStore((state) => state.isUpdatingProfile);
  const updateProfile = useAuthStore((state) => state.updateProfile);

  const [nickName, setNickName] = useState(user?.nickName ?? '');

  useEffect(() => {
    setNickName(user?.nickName ?? '');
  }, [user?.nickName]);

  const handleSave = useCallback(async () => {
    const trimmed = nickName.trim();
    if (!trimmed) {
      showErrorToast('请输入昵称');
      return;
    }

    await updateProfile({
      nickName: trimmed,
      gender: user?.gender ?? DEFAULT_GENDER,
      birthday: user?.birthday ?? DEFAULT_BIRTHDAY,
    });
  }, [nickName, updateProfile, user?.birthday, user?.gender]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>我的</Text>

        <Text style={styles.label}>用户名</Text>
        <Text style={styles.readOnlyValue}>{user?.username || '—'}</Text>

        <Text style={styles.label}>昵称</Text>
        <TextInput
          style={styles.input}
          value={nickName}
          onChangeText={setNickName}
          placeholder="请输入昵称"
          placeholderTextColor={PLACEHOLDER_COLOR}
          autoCapitalize="none"
          autoCorrect={false}
          editable={!isUpdatingProfile}
          returnKeyType="done"
          onSubmitEditing={() => {
            void handleSave();
          }}
        />

        <Pressable
          style={[styles.button, isUpdatingProfile && styles.buttonDisabled]}
          onPress={() => {
            void handleSave();
          }}
          disabled={isUpdatingProfile}>
          {isUpdatingProfile ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.buttonText}>保存</Text>
          )}
        </Pressable>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: APP_TEXT_COLOR,
    marginBottom: 28,
  },
  label: {
    fontSize: 13,
    color: '#666666',
    marginBottom: 8,
  },
  readOnlyValue: {
    fontSize: 16,
    color: APP_TEXT_COLOR,
    marginBottom: 20,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#dddddd',
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 16,
    color: APP_TEXT_COLOR,
    marginBottom: 20,
    backgroundColor: '#fafafa',
  },
  button: {
    height: 48,
    borderRadius: 10,
    backgroundColor: PRIMARY_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
