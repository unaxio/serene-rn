import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect } from 'react';

import { ConnectNotificationScreen } from '@/src/features/connect/components/ConnectNotificationScreen';
import { CONNECT_NOTIFICATION_CATEGORIES } from '@/src/features/connect/constants';
import type { ConnectNotificationCategory } from '@/src/features/connect/types';
import { showToast } from '@/src/utils/toast';

function isCategory(value: string): value is ConnectNotificationCategory {
  return CONNECT_NOTIFICATION_CATEGORIES.some((item) => item === value);
}

export default function NotificationCategoryRoute() {
  const router = useRouter();
  const { category } = useLocalSearchParams<{ category: string }>();
  const value = Array.isArray(category) ? category[0] : category;

  useEffect(() => {
    if (value && !isCategory(value)) {
      showToast('该内容暂不可查看');
      router.back();
    }
  }, [router, value]);

  if (!value || !isCategory(value)) {
    return null;
  }

  return <ConnectNotificationScreen category={value} />;
}
