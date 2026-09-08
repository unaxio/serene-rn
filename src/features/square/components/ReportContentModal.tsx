import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

import { FullScreenModal } from '@/src/components/FullScreenModal';
import { PublishSubmitButton } from '@/src/features/square/components/publish/PublishSubmitButton';
import {
  ACCENT_COLOR,
  MUTED_TEXT_COLOR,
  PLACEHOLDER_TEXT_COLOR,
  REPORT_DETAIL_PLACEHOLDER,
  REPORT_MODAL_TITLE,
  REPORT_REASON_OPTIONS,
  REPORT_REASON_REQUIRED,
  REPORT_SUBMIT_LABEL,
  SEARCH_BAR_BG,
} from '@/src/features/square/constants';
import { APP_TEXT_COLOR } from '@/constants/Colors';
import { showErrorToast } from '@/src/utils/toast';

interface ReportContentModalProps {
  visible: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (reason: string, detail: string) => Promise<boolean>;
}

const DETAIL_MIN_HEIGHT = 100;
const CHIP_RADIUS = 16;

export function ReportContentModal({
  visible,
  isSubmitting,
  onClose,
  onSubmit,
}: ReportContentModalProps) {
  const [reason, setReason] = useState<string | null>(null);
  const [detail, setDetail] = useState('');

  const handleClose = useCallback(() => {
    setReason(null);
    setDetail('');
    onClose();
  }, [onClose]);

  const handleSubmit = useCallback(async () => {
    if (!reason) {
      showErrorToast(REPORT_REASON_REQUIRED);
      return;
    }
    const ok = await onSubmit(reason, detail.trim());
    if (ok) {
      setReason(null);
      setDetail('');
    }
  }, [detail, onSubmit, reason]);

  return (
    <FullScreenModal visible={visible} title={REPORT_MODAL_TITLE} onBack={handleClose}>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled">
        <Text style={styles.section}>选择举报类型</Text>
        <View style={styles.chips}>
          {REPORT_REASON_OPTIONS.map((item) => {
            const selected = item === reason;
            return (
              <Pressable
                key={item}
                style={[styles.chip, selected && styles.chipSelected]}
                onPress={() => setReason(item)}>
                <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                  {item}
                </Text>
              </Pressable>
            );
          })}
        </View>
        <Text style={styles.section}>具体原因</Text>
        <TextInput
          style={styles.detail}
          value={detail}
          onChangeText={setDetail}
          placeholder={REPORT_DETAIL_PLACEHOLDER}
          placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
          multiline
          textAlignVertical="top"
        />
        <PublishSubmitButton
          enabled={Boolean(reason)}
          isSubmitting={isSubmitting}
          label={REPORT_SUBMIT_LABEL}
          onPress={() => {
            void handleSubmit();
          }}
        />
      </KeyboardAwareScrollView>
    </FullScreenModal>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    gap: 12,
  },
  section: {
    fontSize: 14,
    fontWeight: '600',
    color: APP_TEXT_COLOR,
    marginTop: 4,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: CHIP_RADIUS,
    backgroundColor: SEARCH_BAR_BG,
  },
  chipSelected: {
    backgroundColor: ACCENT_COLOR,
  },
  chipText: {
    fontSize: 13,
    color: MUTED_TEXT_COLOR,
  },
  chipTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  detail: {
    minHeight: DETAIL_MIN_HEIGHT,
    borderRadius: 12,
    backgroundColor: SEARCH_BAR_BG,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    lineHeight: 22,
    color: APP_TEXT_COLOR,
  },
});
