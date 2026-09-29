import { useQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { PROFILE_QUERY_KEYS } from '@/src/features/profile/constants';
import { getRegions } from '@/src/features/profile/regionApi';
import type { RegionOption, RegionPathItem } from '@/src/features/profile/regionTypes';

export function useRegionPicker(visible: boolean) {
  const [crumbs, setCrumbs] = useState<RegionPathItem[]>([]);
  const parentCode = crumbs.length > 0 ? crumbs[crumbs.length - 1]?.code : undefined;

  useEffect(() => {
    if (!visible) {
      setCrumbs([]);
    }
  }, [visible]);

  const query = useQuery({
    queryKey: PROFILE_QUERY_KEYS.regions(parentCode),
    queryFn: () => getRegions(parentCode),
    enabled: visible,
  });

  const items = useMemo(() => query.data ?? [], [query.data]);

  const goBack = useCallback((): boolean => {
    if (crumbs.length === 0) {
      return false;
    }
    setCrumbs((prev) => prev.slice(0, -1));
    return true;
  }, [crumbs.length]);

  const jumpTo = useCallback((index: number) => {
    setCrumbs((prev) => prev.slice(0, index));
  }, []);

  const openChild = useCallback((item: RegionOption) => {
    setCrumbs((prev) => [...prev, { code: item.code, name: item.name }]);
  }, []);

  return {
    crumbs,
    items,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
    goBack,
    jumpTo,
    openChild,
  };
}
