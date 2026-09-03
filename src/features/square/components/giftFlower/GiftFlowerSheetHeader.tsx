import { Pressable, StyleSheet, Text, View } from 'react-native';

import { APP_TEXT_COLOR } from '@/constants/Colors';
import { MUTED_TEXT_COLOR } from '@/src/features/square/constants';

interface GiftFlowerSheetHeaderProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  onClose: () => void;
}

export function GiftFlowerSheetHeader({
  title,
  showBack = false,
  onBack,
  onClose,
}: GiftFlowerSheetHeaderProps) {
  return (
    <View style={styles.header}>
      {showBack && onBack ? (
        <Pressable onPress={onBack} hitSlop={12}>
          <Text style={styles.sideAction}>返回</Text>
        </Pressable>
      ) : (
        <View style={styles.sideSlot} />
      )}
      <Text style={styles.title}>{title}</Text>
      <Pressable onPress={onClose} hitSlop={12}>
        <Text style={styles.close}>✕</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sideSlot: {
    width: 36,
  },
  sideAction: {
    fontSize: 15,
    color: APP_TEXT_COLOR,
    width: 36,
  },
  title: {
    flex: 1,
    fontSize: 17,
    fontWeight: '700',
    color: APP_TEXT_COLOR,
    textAlign: 'center',
  },
  close: {
    width: 36,
    textAlign: 'right',
    fontSize: 18,
    color: MUTED_TEXT_COLOR,
  },
});
