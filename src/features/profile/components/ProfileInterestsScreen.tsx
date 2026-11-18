import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

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
const SAVE_BUTTON_HEIGHT = 48;
const SAVE_BAR_VERTICAL_PADDING = 12;
const SAVE_CONTENT_GAP = 16;

export function ProfileInterestsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const listPaddingBottom = SAVE_BUTTON_HEIGHT + SAVE_BAR_VERTICAL_PADDING * 2 + insets.bottom + SAVE_CONTENT_GAP;
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
      router.back();
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
        <ScrollView style={styles.list} contentContainerStyle={[styles.body, { paddingBottom: listPaddingBottom }]}>
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
        </ScrollView>
      )}
      {status === 'loading' && catalogs.length === 0 ? null : (
        <View style={[styles.saveBar, { paddingBottom: SAVE_BAR_VERTICAL_PADDING + insets.bottom }]}>
          <Pressable
            style={[styles.save, mutation.isPending && styles.saveDisabled]}
            disabled={mutation.isPending || status === 'error'}
            onPress={handleSave}>
            <Text style={styles.saveText}>{mutation.isPending ? '保存中' : '保存'}</Text>
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: PROFILE_PAGE_BG },
  loading: { marginTop: 40 },
  list: { flex: 1 },
  body: { paddingHorizontal: 16, paddingTop: 16 },
  hint: { marginBottom: 16, fontSize: 13, lineHeight: 20, color: '#94A3B8' },
  status: { textAlign: 'center', color: PROFILE_MUTED, paddingVertical: 24 },
  saveBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingTop: SAVE_BAR_VERTICAL_PADDING,
    backgroundColor: PROFILE_PAGE_BG,
  },
  save: {
    height: SAVE_BUTTON_HEIGHT,
    borderRadius: 24,
    backgroundColor: PROFILE_ACCENT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveDisabled: { opacity: 0.6 },
  saveText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
});
