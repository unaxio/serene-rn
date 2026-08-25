import { memo, useCallback, useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { FullScreenModal } from '@/src/components/FullScreenModal';
import { DuoCheckInPanel } from '@/src/features/soulFlower/components/DuoCheckInPanel';
import { PartnerInviteModal } from '@/src/features/soulFlower/components/PartnerInviteModal';
import { PersonalCheckInPanel } from '@/src/features/soulFlower/components/PersonalCheckInPanel';
import type { PartnerStatusResponse } from '@/src/features/soulFlower/types';

export type StreakCheckInTab = 'personal' | 'duo';

interface StreakCheckInModalProps {
  visible: boolean;
  onClose: () => void;
  initialTab: StreakCheckInTab;
  hasPartner: boolean;
  partnerStatus?: PartnerStatusResponse;
}

const TABS_CONTAINER_HEIGHT = 42;
const TAB_HEIGHT = 34;
const TABS_INNER_GAP = 3;
const TABS_BORDER_COLOR = '#efedfd';
const TAB_ACTIVE_BG = '#efedfd';
const TAB_ACTIVE_TEXT = '#3612dd';
const TAB_INACTIVE_TEXT = '#94A3B8';
const CONTENT_HORIZONTAL_PADDING = 20;
const TABS_BORDER_RADIUS = 16;
const TAB_BORDER_RADIUS = TABS_BORDER_RADIUS - TABS_INNER_GAP;
const INVITE_BUTTON_HEIGHT = 44;
const INVITE_BUTTON_BG = '#efedfd';
const INVITE_BUTTON_TEXT = '#3612dd';
const TAB_CONTENT_TOP_GAP = 20;

const TAB_ITEMS: ReadonlyArray<{ key: StreakCheckInTab; label: string }> = [
  { key: 'personal', label: '个人打卡' },
  { key: 'duo', label: '双人打卡' },
];

function StreakCheckInModalComponent({
  visible,
  onClose,
  initialTab,
  hasPartner,
  partnerStatus,
}: StreakCheckInModalProps) {
  const [activeTab, setActiveTab] = useState<StreakCheckInTab>(initialTab);
  const [inviteVisible, setInviteVisible] = useState(false);

  useEffect(() => {
    if (!visible) {
      setInviteVisible(false);
      return;
    }
    setActiveTab(initialTab);
  }, [initialTab, visible]);

  const handleSelectTab = useCallback((tab: StreakCheckInTab) => {
    setActiveTab(tab);
  }, []);

  const handleOpenInvite = useCallback(() => {
    setInviteVisible(true);
  }, []);

  const handleCloseInvite = useCallback(() => {
    setInviteVisible(false);
  }, []);

  return (
    <>
      <FullScreenModal visible={visible} title="连续打卡" onBack={onClose}>
        <View style={styles.content}>
          <View style={styles.tabsContainer}>
            {TAB_ITEMS.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <Pressable
                  key={tab.key}
                  style={[styles.tab, isActive ? styles.tabActive : undefined]}
                  onPress={() => handleSelectTab(tab.key)}>
                  <Text
                    style={[
                      styles.tabText,
                      isActive ? styles.tabTextActive : styles.tabTextInactive,
                    ]}>
                    {tab.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {activeTab === 'personal' ? (
            <PersonalCheckInPanel
              partnerStatus={partnerStatus}
              enabled={visible && activeTab === 'personal'}
            />
          ) : null}

          {activeTab === 'duo' ? (
            hasPartner ? (
              <DuoCheckInPanel
                partnerStatus={partnerStatus}
                enabled={visible && activeTab === 'duo'}
              />
            ) : (
              <View style={styles.tabContent}>
                <Pressable style={styles.inviteButton} onPress={handleOpenInvite}>
                  <Text style={styles.inviteButtonText}>邀请伙伴</Text>
                </Pressable>
              </View>
            )
          ) : null}
        </View>
      </FullScreenModal>

      <PartnerInviteModal visible={inviteVisible} onClose={handleCloseInvite} />
    </>
  );
}

export const StreakCheckInModal = memo(StreakCheckInModalComponent);

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: CONTENT_HORIZONTAL_PADDING,
  },
  tabsContainer: {
    width: '100%',
    height: TABS_CONTAINER_HEIGHT,
    borderWidth: 1,
    borderColor: TABS_BORDER_COLOR,
    borderRadius: TABS_BORDER_RADIUS,
    padding: TABS_INNER_GAP,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tab: {
    flex: 1,
    height: TAB_HEIGHT,
    borderRadius: TAB_BORDER_RADIUS,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabActive: {
    backgroundColor: TAB_ACTIVE_BG,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  tabTextActive: {
    color: TAB_ACTIVE_TEXT,
  },
  tabTextInactive: {
    color: TAB_INACTIVE_TEXT,
  },
  tabContent: {
    marginTop: TAB_CONTENT_TOP_GAP,
  },
  inviteButton: {
    height: INVITE_BUTTON_HEIGHT,
    borderRadius: INVITE_BUTTON_HEIGHT / 2,
    backgroundColor: INVITE_BUTTON_BG,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inviteButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: INVITE_BUTTON_TEXT,
  },
});
