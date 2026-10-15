import type { ReactNode } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { ProfileEmptyPane } from '@/src/features/profile/components/ProfileEmptyPane';
import { PROFILE_ACCENT, PROFILE_PAGE_BG } from '@/src/features/profile/constants';

interface ProfileHomeGateProps {
  header: ReactNode;
  message?: string;
  loading?: boolean;
  onRetry?: () => void;
}

export function ProfileHomeGate({
  header,
  message = '',
  loading = false,
  onRetry,
}: ProfileHomeGateProps) {
  return (
    <View style={styles.root}>
      {header}
      {loading ? (
        <ActivityIndicator style={styles.loading} color={PROFILE_ACCENT} />
      ) : (
        <View style={styles.errorBox}>
          <ProfileEmptyPane message={message} />
          {onRetry ? (
            <Pressable onPress={onRetry}>
              <Text style={styles.retry}>重试</Text>
            </Pressable>
          ) : null}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: PROFILE_PAGE_BG },
  loading: { marginTop: 80 },
  errorBox: { flex: 1, alignItems: 'center', gap: 8 },
  retry: { fontSize: 14, fontWeight: '600', color: PROFILE_ACCENT },
});
