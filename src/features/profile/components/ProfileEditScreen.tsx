import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { APP_TEXT_COLOR } from '@/constants/Colors';
import { ProfileChipGroup } from '@/src/features/profile/components/ProfileChipGroup';
import { ProfileEditAvatarField } from '@/src/features/profile/components/ProfileEditAvatarField';
import {
  PROFILE_ACCENT,
  PROFILE_BIO_MAX_LENGTH,
  PROFILE_GENDER_OPTIONS,
  PROFILE_MUTED,
  PROFILE_PAGE_BG,
  RELATIONSHIP_STATUS_OPTIONS,
} from '@/src/features/profile/constants';
import { useProfileEditForm } from '@/src/features/profile/hooks/useProfileEditForm';
import { SquarePageHeader } from '@/src/features/square/components/SquarePageHeader';

export function ProfileEditScreen() {
  const router = useRouter();
  const form = useProfileEditForm();

  return (
    <SafeAreaView style={styles.safe} edges={[]}>
      <SquarePageHeader title="编辑资料" onBack={() => router.back()} />
      <KeyboardAwareScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled">
        <ProfileEditAvatarField
          uri={form.avatarPreview}
          uploading={form.uploading}
          onPress={() => {
            void form.handlePickAvatar();
          }}
        />
        <Text style={styles.label}>昵称</Text>
        <TextInput
          style={styles.input}
          value={form.nickName}
          onChangeText={form.setNickName}
          maxLength={20}
          placeholder="请输入昵称"
          placeholderTextColor={PROFILE_MUTED}
        />
        <Text style={styles.label}>个性签名</Text>
        <TextInput
          style={[styles.input, styles.bio]}
          value={form.bio}
          onChangeText={(text) => form.setBio(text.slice(0, PROFILE_BIO_MAX_LENGTH))}
          maxLength={PROFILE_BIO_MAX_LENGTH}
          multiline
          placeholder="介绍一下自己"
          placeholderTextColor={PROFILE_MUTED}
        />
        <Text style={styles.counter}>
          {form.bio.length}/{PROFILE_BIO_MAX_LENGTH}
        </Text>
        <Text style={styles.label}>性别</Text>
        <ProfileChipGroup
          options={PROFILE_GENDER_OPTIONS}
          value={form.gender}
          onChange={form.setGender}
        />
        <Text style={styles.label}>生日（YYYY-MM-DD）</Text>
        <TextInput
          style={styles.input}
          value={form.birthday}
          onChangeText={form.setBirthday}
          placeholder="2000-01-01"
          placeholderTextColor={PROFILE_MUTED}
        />
        <Text style={styles.label}>星座</Text>
        <Text style={styles.readOnly}>{form.constellation}</Text>
        <Text style={styles.label}>所在地区</Text>
        <TextInput
          style={styles.input}
          value={form.region}
          onChangeText={form.setRegion}
          placeholder="例如：上海"
          placeholderTextColor={PROFILE_MUTED}
        />
        <Text style={styles.label}>感情状态</Text>
        <ProfileChipGroup
          options={RELATIONSHIP_STATUS_OPTIONS}
          value={form.relationshipStatus}
          onChange={form.setRelationshipStatus}
        />
        <Pressable
          style={[styles.save, (form.saving || form.uploading) && styles.saveDisabled]}
          disabled={form.saving || form.uploading}
          onPress={() => {
            void form.handleSave();
          }}>
          <Text style={styles.saveText}>保存</Text>
        </Pressable>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: PROFILE_PAGE_BG },
  content: { paddingHorizontal: 16, paddingBottom: 40, gap: 8 },
  label: { fontSize: 13, color: PROFILE_MUTED, marginTop: 8 },
  input: {
    minHeight: 44,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    fontSize: 15,
    color: APP_TEXT_COLOR,
  },
  bio: { minHeight: 80, textAlignVertical: 'top' },
  counter: { alignSelf: 'flex-end', fontSize: 12, color: PROFILE_MUTED },
  readOnly: {
    fontSize: 15,
    color: APP_TEXT_COLOR,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
  },
  save: {
    marginTop: 20,
    height: 48,
    borderRadius: 24,
    backgroundColor: PROFILE_ACCENT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveDisabled: { opacity: 0.6 },
  saveText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
});
