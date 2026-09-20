import { Pressable, StyleSheet, Text } from 'react-native';

import { BottomSheetModal } from '@/src/components/BottomSheetModal';
import { APP_TEXT_COLOR } from '@/constants/Colors';

interface DmActionSheetProps {
  visible: boolean;
  mine: boolean;
  onClose: () => void;
  onCopy: () => void;
  onQuote: () => void;
  onReport: () => void;
  onDelete: () => void;
}

export function DmActionSheet({
  visible,
  mine,
  onClose,
  onCopy,
  onQuote,
  onReport,
  onDelete,
}: DmActionSheetProps) {
  const items = [
    { label: '复制', onPress: onCopy },
    { label: '引用', onPress: onQuote },
    mine ? { label: '删除', onPress: onDelete } : { label: '举报', onPress: onReport },
  ];

  return (
    <BottomSheetModal visible={visible} onClose={onClose}>
      {items.map((item) => (
        <Pressable
          key={item.label}
          style={styles.item}
          onPress={() => {
            onClose();
            item.onPress();
          }}>
          <Text style={styles.label}>{item.label}</Text>
        </Pressable>
      ))}
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  item: { paddingVertical: 14, paddingHorizontal: 20 },
  label: { fontSize: 16, color: APP_TEXT_COLOR, textAlign: 'center' },
});
