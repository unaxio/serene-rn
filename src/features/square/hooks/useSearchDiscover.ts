import { useCallback, useEffect, useState } from 'react';

import { SEARCH_HISTORY_LIMIT } from '@/src/features/square/constants';
import {
  clearSearchHistory,
  getSearchHistory,
  getSearchHot,
} from '@/src/features/square/searchApi';
import type { SearchHotItem } from '@/src/features/square/types';

function dropHotItem(items: SearchHotItem[], id: string): SearchHotItem[] {
  return items
    .filter((item) => item.id !== id)
    .map((item, index) => ({ ...item, rank: index + 1 }));
}

export function useSearchDiscover() {
  const [history, setHistory] = useState<string[]>([]);
  const [stories, setStories] = useState<SearchHotItem[]>([]);
  const [asks, setAsks] = useState<SearchHotItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [hotFailed, setHotFailed] = useState(false);

  const applyHot = useCallback((nextStories: SearchHotItem[], nextAsks: SearchHotItem[]) => {
    setStories(nextStories);
    setAsks(nextAsks);
    setHotFailed(false);
  }, []);

  useEffect(() => {
    let alive = true;
    void (async () => {
      const [historyResult, hotResult] = await Promise.allSettled([
        getSearchHistory(),
        getSearchHot(),
      ]);
      if (!alive) {
        return;
      }
      if (historyResult.status === 'fulfilled') {
        setHistory(historyResult.value);
      }
      if (hotResult.status === 'fulfilled') {
        applyHot(hotResult.value.stories, hotResult.value.asks);
      } else {
        setHotFailed(true);
      }
      setLoading(false);
    })();
    return () => {
      alive = false;
    };
  }, [applyHot]);

  const refreshHot = useCallback(async () => {
    setRefreshing(true);
    try {
      const hot = await getSearchHot();
      applyHot(hot.stories, hot.asks);
    } catch {
      // 请求层已经提示；刷新失败保留这一屏的榜单顺序。
    } finally {
      setRefreshing(false);
    }
  }, [applyHot]);

  const rememberKeyword = useCallback((keyword: string) => {
    const trimmed = keyword.trim();
    if (trimmed.length === 0) {
      return;
    }
    setHistory((current) => {
      const next = [trimmed, ...current.filter((item) => item !== trimmed)];
      return next.slice(0, SEARCH_HISTORY_LIMIT);
    });
  }, []);

  const clearHistory = useCallback(async () => {
    let previous: string[] = [];
    setHistory((current) => {
      previous = current;
      return [];
    });
    try {
      await clearSearchHistory();
    } catch {
      setHistory(previous);
    }
  }, []);

  const removeHot = useCallback((kind: 'story' | 'ask', id: string) => {
    if (kind === 'story') {
      setStories((current) => dropHotItem(current, id));
      return;
    }
    setAsks((current) => dropHotItem(current, id));
  }, []);

  return {
    history,
    stories,
    asks,
    loading,
    refreshing,
    hotFailed,
    refreshHot,
    rememberKeyword,
    clearHistory,
    removeHot,
  };
}
