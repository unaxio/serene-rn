import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { APP_TEXT_COLOR } from '@/constants/Colors';
import { getAiRoles } from '@/src/features/connect/api';
import { ConnectAvatar } from '@/src/features/connect/components/ConnectAvatar';
import { CONNECT_QUERY_KEYS } from '@/src/features/connect/constants';
import { readRememberedAiRole } from '@/src/features/connect/utils/aiSessionDraft';
import { ACCENT_COLOR, MUTED_TEXT_COLOR, SQUARE_PAGE_BG } from '@/src/features/square/constants';
import { useAuthStore } from '@/src/store/authStore';

interface AiRolePickerProps {
  confirming: boolean;
  onConfirm: (roleId: string) => void;
}

const AVATAR_SIZE = 56;

export function AiRolePicker({ confirming, onConfirm }: AiRolePickerProps) {
  const isAuthenticated = useAuthStore((state) => state.status === 'authenticated');
  const rolesQuery = useQuery({
    queryKey: CONNECT_QUERY_KEYS.aiRoles,
    queryFn: getAiRoles,
    enabled: isAuthenticated,
  });
  const preferred = rolesQuery.data?.lastRoleId ?? readRememberedAiRole();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const activeId = selectedId ?? preferred;

  return (
    <View style={styles.root}>
      {rolesQuery.isLoading ? <ActivityIndicator color={ACCENT_COLOR} style={styles.status} /> : null}
      {rolesQuery.isError ? <Text style={styles.status}>角色加载失败</Text> : null}
      {!rolesQuery.isLoading && (rolesQuery.data?.items.length ?? 0) === 0 ? (
        <Text style={styles.status}>暂无可用角色</Text>
      ) : null}
      <ScrollView contentContainerStyle={styles.list}>
        {rolesQuery.data?.items.map((role) => {
          const selected = role.id === activeId;
          return (
            <Pressable
              key={role.id}
              style={[styles.card, selected && styles.cardOn]}
              onPress={() => setSelectedId(role.id)}>
              <ConnectAvatar uri={role.avatarUrl} name={role.name} size={AVATAR_SIZE} />
              <View style={styles.body}>
                <Text style={styles.name}>{role.name}</Text>
                <Text style={styles.type}>{role.typeLabel}</Text>
                <Text style={styles.intro} numberOfLines={2}>
                  {role.intro}
                </Text>
                {role.onlineCount > 0 ? (
                  <Text style={styles.online}>{role.onlineCount} 人在聊</Text>
                ) : null}
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
      <Pressable
        style={[styles.confirm, (!activeId || confirming) && styles.disabled]}
        disabled={!activeId || confirming}
        onPress={() => {
          if (activeId) {
            onConfirm(activeId);
          }
        }}>
        {confirming ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.confirmText}>开始对话</Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: SQUARE_PAGE_BG },
  status: { textAlign: 'center', marginTop: 24, color: MUTED_TEXT_COLOR },
  list: { padding: 16, gap: 12 },
  card: {
    flexDirection: 'row',
    gap: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  cardOn: { borderColor: ACCENT_COLOR },
  body: { flex: 1, gap: 2 },
  name: { fontSize: 16, fontWeight: '700', color: APP_TEXT_COLOR },
  type: { fontSize: 12, color: ACCENT_COLOR },
  intro: { fontSize: 13, color: MUTED_TEXT_COLOR },
  online: { fontSize: 12, color: MUTED_TEXT_COLOR },
  confirm: {
    margin: 16,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ACCENT_COLOR,
  },
  disabled: { opacity: 0.5 },
  confirmText: { color: '#FFFFFF', fontWeight: '700' },
});
