import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { SafeAreaView } from 'react-native-safe-area-context';

import { APP_TEXT_COLOR } from '@/constants/Colors';
import { getHelpFaqs, submitHelpFeedback } from '@/src/features/profile/api';
import { ProfileChipGroup } from '@/src/features/profile/components/ProfileChipGroup';
import {
  PROFILE_ACCENT,
  PROFILE_MUTED,
  PROFILE_PAGE_BG,
  PROFILE_QUERY_KEYS,
} from '@/src/features/profile/constants';
import type { HelpFeedbackPayload } from '@/src/features/profile/types';
import { SquarePageHeader } from '@/src/features/square/components/SquarePageHeader';
import { toastCaughtFailure } from '@/src/utils/requestError';
import { showErrorToast, showToast } from '@/src/utils/toast';

const FEEDBACK_TYPES = [
  { id: 'feedback', label: '问题反馈' },
  { id: 'suggestion', label: '功能建议' },
] as const;

const CONTENT_MIN_LENGTH = 5;

export function ProfileHelpScreen() {
  const router = useRouter();
  const [type, setType] = useState<HelpFeedbackPayload['type']>('feedback');
  const [content, setContent] = useState('');
  const [contact, setContact] = useState('');

  const faqsQuery = useQuery({
    queryKey: PROFILE_QUERY_KEYS.helpFaqs,
    queryFn: getHelpFaqs,
  });

  const mutation = useMutation({
    mutationFn: submitHelpFeedback,
    onSuccess: () => {
      setContent('');
      setContact('');
      showToast('反馈已提交');
    },
    onError: toastCaughtFailure,
  });

  const handleSubmit = useCallback(() => {
    const trimmed = content.trim();
    if (trimmed.length < CONTENT_MIN_LENGTH) {
      showErrorToast('请填写更详细的反馈内容');
      return;
    }
    void mutation.mutateAsync({
      type,
      content: trimmed,
      contact: contact.trim() || undefined,
    });
  }, [contact, content, mutation, type]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <SquarePageHeader title="帮助与反馈" onBack={() => router.back()} />
      <KeyboardAwareScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled">
        <Text style={styles.section}>常见问题</Text>
        {faqsQuery.isLoading ? (
          <ActivityIndicator color={PROFILE_ACCENT} />
        ) : (
          (faqsQuery.data ?? []).map((faq) => (
            <View key={faq.id} style={styles.faq}>
              <Text style={styles.q}>{faq.question}</Text>
              <Text style={styles.a}>{faq.answer}</Text>
            </View>
          ))
        )}
        {!faqsQuery.isLoading && (faqsQuery.data?.length ?? 0) === 0 ? (
          <Text style={styles.empty}>暂无常见问题</Text>
        ) : null}
        <Text style={styles.section}>提交反馈</Text>
        <ProfileChipGroup options={FEEDBACK_TYPES} value={type} onChange={setType} />
        <TextInput
          style={[styles.input, styles.textarea]}
          value={content}
          onChangeText={setContent}
          multiline
          placeholder="请描述你的问题或建议"
          placeholderTextColor={PROFILE_MUTED}
        />
        <TextInput
          style={styles.input}
          value={contact}
          onChangeText={setContact}
          placeholder="联系方式（选填）"
          placeholderTextColor={PROFILE_MUTED}
        />
        <Pressable
          style={[styles.save, mutation.isPending && styles.saveDisabled]}
          disabled={mutation.isPending}
          onPress={handleSubmit}>
          <Text style={styles.saveText}>提交</Text>
        </Pressable>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: PROFILE_PAGE_BG },
  content: { paddingHorizontal: 16, paddingBottom: 40, gap: 10 },
  section: { fontSize: 15, fontWeight: '700', color: APP_TEXT_COLOR, marginTop: 8 },
  faq: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    gap: 6,
  },
  q: { fontSize: 14, fontWeight: '600', color: APP_TEXT_COLOR },
  a: { fontSize: 13, lineHeight: 18, color: PROFILE_MUTED },
  empty: { fontSize: 13, color: PROFILE_MUTED },
  input: {
    minHeight: 44,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    fontSize: 15,
    color: APP_TEXT_COLOR,
  },
  textarea: { minHeight: 100, textAlignVertical: 'top' },
  save: {
    marginTop: 8,
    height: 48,
    borderRadius: 24,
    backgroundColor: PROFILE_ACCENT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveDisabled: { opacity: 0.6 },
  saveText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
});
