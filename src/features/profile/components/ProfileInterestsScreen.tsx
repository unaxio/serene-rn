import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { InterestCatalogGroup } from '@/src/features/profile/components/InterestCatalogGroup';
import { getInterests, putInterests } from '@/src/features/profile/api';
import { MAX_INTEREST_TOPICS, PROFILE_ACCENT, PROFILE_MUTED, PROFILE_PAGE_BG } from '@/src/features/profile/constants';
import {
  sanitizeInterestItems,
  toggleInterestCategory,
  toggleInterestTopic,
  type InterestGroup,
} from '@/src/features/profile/interests';
import { SquarePageHeader } from '@/src/features/square/components/SquarePageHeader';
import { toastCaughtFailure } from '@/src/utils/requestError';
import { showToast } from '@/src/utils/toast';

const INTEREST_LIMIT_TOAST = `每个主题最多选择 ${MAX_INTEREST_TOPICS} 个细分`;

export function ProfileInterestsScreen() {
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'ready' | 'empty' | 'error'>('loading');
  const [catalogs, setCatalogs] = useState<InterestGroup[]>([]);
  const [items, setItems] = useState<InterestGroup[]>([]);

  const load = useCallback(async () => {
    setStatus('loading');
    try {
      const board = await getInterests();
      setCatalogs(board.catalogs);
      setItems(board.items);
      setStatus(board.catalogs.length > 0 ? 'ready' : 'empty');
    } catch (error) {
      setStatus('error');
      toastCaughtFailure(error);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const mutation = useMutation({
    mutationFn: putInterests,
    onSuccess: (board) => {
      if (board.catalogs.length > 0) {
        setCatalogs(board.catalogs);
      }
      setItems(board.items);
      showToast('内容偏好已保存');
    },
    onError: toastCaughtFailure,
  });

  const handleCategory = useCallback((category: string) => {
    setItems((prev) => toggleInterestCategory(prev, category));
  }, []);

  const handleTopic = useCallback((category: string, topic: string) => {
    setItems((prev) => {
      const next = toggleInterestTopic(prev, category, topic);
      if (next.limited) {
        showToast(INTEREST_LIMIT_TOAST);
        return prev;
      }
      return next.items;
    });
  }, []);

  const handleSave = useCallback(() => {
    mutation.mutate({ items: sanitizeInterestItems(items, catalogs) });
  }, [catalogs, items, mutation]);

  return (
    <SafeAreaView style={styles.safe} edges={[]}>
      <SquarePageHeader title="内容偏好" onBack={() => router.back()} />
      {status === 'loading' && catalogs.length === 0 ? (
        <ActivityIndicator style={styles.loading} color={PROFILE_ACCENT} />
      ) : (
        <ScrollView contentContainerStyle={styles.body}>
          <Text style={styles.hint}>
            点主主题只选大类；再点细分话题。每个大类最多 {MAX_INTEREST_TOPICS} 个。全部取消后保存即清空。
          </Text>
          {status === 'error' ? (
            <Pressable onPress={() => void load()}>
              <Text style={styles.status}>加载失败，点击重试</Text>
            </Pressable>
          ) : null}
          {status === 'empty' ? <Text style={styles.status}>暂无可选话题</Text> : null}
          {catalogs.map((catalog) => (
            <InterestCatalogGroup
              key={catalog.category}
              category={catalog.category}
              topics={catalog.topics}
              checked={items.some((item) => item.category === catalog.category)}
              selectedTopics={items.find((item) => item.category === catalog.category)?.topics ?? []}
              onToggleCategory={handleCategory}
              onToggleTopic={handleTopic}
            />
          ))}
          <Pressable
            style={[styles.save, mutation.isPending && styles.saveDisabled]}
            disabled={mutation.isPending || status === 'error'}
            onPress={handleSave}>
            <Text style={styles.saveText}>{mutation.isPending ? '保存中' : '保存'}</Text>
          </Pressable>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: PROFILE_PAGE_BG },
  loading: { marginTop: 40 },
  body: { paddingHorizontal: 16, paddingBottom: 32 },
  hint: { marginBottom: 16, fontSize: 13, lineHeight: 20, color: '#94A3B8' },
  status: { textAlign: 'center', color: PROFILE_MUTED, paddingVertical: 24 },
  save: {
    height: 48,
    marginTop: 8,
    borderRadius: 24,
    backgroundColor: PROFILE_ACCENT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveDisabled: { opacity: 0.6 },
  saveText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
});
