import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { APP_TEXT_COLOR } from '@/constants/Colors';
import { ACCENT_COLOR, SQUARE_PAGE_BG } from '@/src/features/square/constants';
import { useAuthStore } from '@/src/store/authStore';

interface ConnectAuthGateProps {
  children: ReactNode;
}

const MIN_TOP_INSET = 12;

export function ConnectAuthGate({ children }: ConnectAuthGateProps) {
  const isAuthenticated = useAuthStore((state) => state.status === 'authenticated');
  const openLoginModal = useAuthStore((state) => state.openLoginModal);
  const insets = useSafeAreaInsets();

  if (isAuthenticated) {
    return children;
  }

  return (
    <View style={[styles.gate, { paddingTop: insets.top + MIN_TOP_INSET }]}>
      <Text style={styles.title}>登录后查看连接</Text>
      <Pressable onPress={openLoginModal} style={styles.button}>
        <Text style={styles.buttonText}>去登录</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  gate: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    backgroundColor: SQUARE_PAGE_BG,
  },
  title: {
    fontSize: 16,
    color: APP_TEXT_COLOR,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: ACCENT_COLOR,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
