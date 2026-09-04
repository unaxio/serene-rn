import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { type ReactNode, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { StyleSheet } from 'react-native';

import { LoginModal } from '@/src/features/auth/components/LoginModal';
import { AppToast } from '@/src/components/AppToast';

interface AppProvidersProps {
  children: ReactNode;
}

const QUERY_STALE_TIME_MS = 60_000;

export function AppProviders({ children }: AppProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: QUERY_STALE_TIME_MS,
            retry: 1,
          },
        },
      }),
  );

  return (
    <GestureHandlerRootView style={styles.root}>
      <KeyboardProvider>
        <QueryClientProvider client={queryClient}>
          {children}
          <LoginModal />
          <AppToast />
        </QueryClientProvider>
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
