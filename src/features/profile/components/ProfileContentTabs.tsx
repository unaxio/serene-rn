import { Pressable, StyleSheet, Text, View } from 'react-native';

import { APP_TEXT_COLOR } from '@/constants/Colors';
import {
  PROFILE_ACCENT,
  PROFILE_CONTENT_TABS,
  PROFILE_MUTED,
  PROFILE_SURFACE,
  type ProfileContentTabId,
} from '@/src/features/profile/constants';

interface ProfileContentTabsProps {
  activeId: ProfileContentTabId;
  onChange: (id: ProfileContentTabId) => void;
}

export function ProfileContentTabs({ activeId, onChange }: ProfileContentTabsProps) {
  return (
    <View style={styles.wrap}>
      {PROFILE_CONTENT_TABS.map((tab) => {
        const active = tab.id === activeId;
        return (
          <Pressable key={tab.id} style={styles.tab} onPress={() => onChange(tab.id)}>
            <Text style={[styles.label, active && styles.labelActive]}>{tab.label}</Text>
            {active ? <View style={styles.underline} /> : <View style={styles.underlinePlaceholder} />}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    backgroundColor: PROFILE_SURFACE,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E2E8F0',
    paddingHorizontal: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 12,
    gap: 8,
  },
  label: {
    fontSize: 15,
    color: PROFILE_MUTED,
    fontWeight: '500',
  },
  labelActive: {
    color: APP_TEXT_COLOR,
    fontWeight: '700',
  },
  underline: {
    width: 24,
    height: 3,
    borderRadius: 2,
    backgroundColor: PROFILE_ACCENT,
  },
  underlinePlaceholder: {
    width: 24,
    height: 3,
  },
});
