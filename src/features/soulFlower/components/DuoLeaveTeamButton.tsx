import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ConfirmDangerModal } from '@/src/features/square/components/ConfirmDangerModal';
import { useDissolvePartner } from '@/src/features/soulFlower/hooks/usePartner';
import { toastCaughtFailure } from '@/src/utils/requestError';

const LEAVE_TEAM_LABEL = '离队';
const DISSOLVE_CONFIRM_TITLE = '确认离队？';
const DISSOLVE_CONFIRM_MESSAGE = '离队后将解除双人打卡关系，需要重新邀请才能再次组队';
const DISSOLVE_CONFIRM_LABEL = '确认离队';
const LEAVE_BUTTON_HEIGHT = 44;
const LEAVE_BUTTON_TEXT = '#DC2626';
const LEAVE_BOTTOM_GAP = 12;

export function DuoLeaveTeamButton() {
  const insets = useSafeAreaInsets();
  const { dissolve, isDissolving } = useDissolvePartner();
  const [confirmVisible, setConfirmVisible] = useState(false);

  const handleOpenConfirm = useCallback(() => {
    setConfirmVisible(true);
  }, []);

  const handleCancel = useCallback(() => {
    if (isDissolving) {
      return;
    }
    setConfirmVisible(false);
  }, [isDissolving]);

  const handleConfirm = useCallback(async () => {
    try {
      const dissolved = await dissolve();
      if (dissolved) {
        setConfirmVisible(false);
      }
    } catch (error) {
      toastCaughtFailure(error);
    }
  }, [dissolve]);

  return (
    <>
      <Pressable
        style={[styles.button, { marginBottom: insets.bottom + LEAVE_BOTTOM_GAP }]}
        disabled={isDissolving}
        onPress={handleOpenConfirm}>
        <Text style={styles.label}>{LEAVE_TEAM_LABEL}</Text>
      </Pressable>
      <ConfirmDangerModal
        visible={confirmVisible}
        title={DISSOLVE_CONFIRM_TITLE}
        message={DISSOLVE_CONFIRM_MESSAGE}
        confirmLabel={DISSOLVE_CONFIRM_LABEL}
        isSubmitting={isDissolving}
        onCancel={handleCancel}
        onConfirm={() => {
          void handleConfirm();
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    height: LEAVE_BUTTON_HEIGHT,
    marginTop: 8,
    borderRadius: LEAVE_BUTTON_HEIGHT / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: LEAVE_BUTTON_TEXT,
  },
});
