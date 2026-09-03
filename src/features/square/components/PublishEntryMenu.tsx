import { useRouter } from 'expo-router';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { APP_TEXT_COLOR } from '@/constants/Colors';
import { COMING_SOON_MESSAGE, PUBLISH_MENU_ITEMS } from '@/src/features/square/constants';
import { useRequireAuth } from '@/src/features/square/hooks/useRequireAuth';
import { showToast } from '@/src/utils/toast';

interface PublishEntryMenuProps {
  visible: boolean;
  onClose: () => void;
}

const MENU_TOP_OFFSET = 56;
const STORY_PUBLISH_ITEM_ID = 'story';
const SHARE_PUBLISH_ITEM_ID = 'share';
const ASK_PUBLISH_ITEM_ID = 'ask';

export function PublishEntryMenu({ visible, onClose }: PublishEntryMenuProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const requireAuth = useRequireAuth();

  const handleSelect = (id: string) => {
    onClose();
    if (id === STORY_PUBLISH_ITEM_ID) {
      if (!requireAuth()) {
        return;
      }
      router.push('/publish/story');
      return;
    }
    if (id === SHARE_PUBLISH_ITEM_ID) {
      if (!requireAuth()) {
        return;
      }
      router.push('/publish/share');
      return;
    }
    if (id === ASK_PUBLISH_ITEM_ID) {
      if (!requireAuth()) {
        return;
      }
      router.push('/publish/ask');
      return;
    }
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
              onPress={() => handleSelect(item.id)}>
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
