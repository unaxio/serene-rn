import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { APP_TEXT_COLOR } from '@/constants/Colors';
import { COMING_SOON_MESSAGE, PUBLISH_MENU_ITEMS } from '@/src/features/square/constants';
import { showToast } from '@/src/utils/toast';

interface PublishEntryMenuProps {
  visible: boolean;
  onClose: () => void;
}

const MENU_TOP_OFFSET = 56;

export function PublishEntryMenu({ visible, onClose }: PublishEntryMenuProps) {
  const insets = useSafeAreaInsets();

  const handleSelect = () => {
    onClose();
    showToast(COMING_SOON_MESSAGE);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <View style={[styles.menu, { marginTop: insets.top + MENU_TOP_OFFSET }]}>
          {PUBLISH_MENU_ITEMS.map((item) => (
            <Pressable
              key={item.id}
              style={styles.item}
              onPress={handleSelect}>
              <Text style={styles.itemText}>{item.label}</Text>
            </Pressable>
          ))}
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.25)',
    alignItems: 'flex-end',
    paddingRight: 16,
  },
  menu: {
    minWidth: 128,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 6,
    shadowColor: APP_TEXT_COLOR,
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  item: {
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  itemText: {
    fontSize: 15,
    fontWeight: '500',
    color: APP_TEXT_COLOR,
  },
});
