import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { getCheckInRecords } from '@/src/features/soulFlower/api';
import { SOUL_FLOWER_QUERY_KEYS } from '@/src/features/soulFlower/constants';
import { normalizeCheckInDateKey } from '@/src/features/soulFlower/utils/checkInCalendar';

function toDateKeySet(rawKeys: string[] | undefined): Set<string> {
  const set = new Set<string>();
  (rawKeys ?? []).forEach((raw) => {
    const key = normalizeCheckInDateKey(raw);
    if (key) {
      set.add(key);
    }
  });
  return set;
}

export function useCheckInRecords(enabled: boolean) {
  const query = useQuery({
    queryKey: SOUL_FLOWER_QUERY_KEYS.checkInRecords,
    queryFn: getCheckInRecords,
    enabled,
  });

  const myAnsweredDateKeys = useMemo(
    () => toDateKeySet(query.data?.me?.answeredDateKeys),
    [query.data?.me?.answeredDateKeys],
  );

  const partnerAnsweredDateKeys = useMemo(
    () => toDateKeySet(query.data?.partner?.answeredDateKeys),
    [query.data?.partner?.answeredDateKeys],
  );

  return {
    data: query.data,
    myAnsweredDateKeys,
    partnerAnsweredDateKeys,
    hasPartner: query.data?.hasPartner === true,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
}
