import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ComingSoonPane } from '@/src/features/square/components/ComingSoonPane';
import { PublishEntryMenu } from '@/src/features/square/components/PublishEntryMenu';
import { SquareHeader } from '@/src/features/square/components/SquareHeader';
import { SquareSearchBar } from '@/src/features/square/components/SquareSearchBar';
import { SquareSubTabs } from '@/src/features/square/components/SquareSubTabs';
import { StoryList } from '@/src/features/square/components/StoryList';
import { SQUARE_PAGE_BG } from '@/src/features/square/constants';
import type { SquareSubTabId } from '@/src/features/square/types';

export function SquareScreen() {
  const [activeTab, setActiveTab] = useState<SquareSubTabId>('story');
  const [publishVisible, setPublishVisible] = useState(false);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <SquareHeader onPublishPress={() => setPublishVisible(true)} />
      <SquareSearchBar />
      <SquareSubTabs activeTab={activeTab} onChange={setActiveTab} />
      <View style={[styles.pane, activeTab !== 'story' && styles.hidden]}>
        <StoryList />
      </View>
      <View style={[styles.pane, activeTab !== 'share' && styles.hidden]}>
        <ComingSoonPane message="分享即将上线" />
      </View>
      <View style={[styles.pane, activeTab !== 'ask' && styles.hidden]}>
        <ComingSoonPane message="问答即将上线" />
      </View>
      <PublishEntryMenu
        visible={publishVisible}
        onClose={() => setPublishVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: SQUARE_PAGE_BG,
  },
  pane: {
    flex: 1,
  },
  hidden: {
    display: 'none',
  },
});
