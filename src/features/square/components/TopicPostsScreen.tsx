import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SymbolView } from 'expo-symbols';

import { APP_TEXT_COLOR } from '@/constants/Colors';
import { TopicPostList } from '@/src/features/square/components/TopicPostList';
import {
  PAGE_SURFACE_COLOR,
  TOPIC_HASH,
  TOPIC_NAME_EMPTY,
  TOPIC_NAME_MAX_LENGTH,
  TOPIC_NAME_TOO_LONG,
} from '@/src/features/square/constants';
import { useSquareSearchNavigation } from '@/src/features/square/hooks/useSquareSearchNavigation';
import { useTopicPosts } from '@/src/features/square/hooks/useTopicPosts';
import { bareTopicName } from '@/src/features/square/topicApi';

interface TopicPostsScreenProps {
  name: string;
}

const ICON_SIZE = 22;
const HEADER_MIN_HEIGHT = 44;
const MIN_TOP_INSET = 12;

export function TopicPostsScreen({ name }: TopicPostsScreenProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const topicName = bareTopicName(name);
  const blockedMessage =
    topicName.length === 0
      ? TOPIC_NAME_EMPTY
      : topicName.length > TOPIC_NAME_MAX_LENGTH
        ? TOPIC_NAME_TOO_LONG
        : '';
  const posts = useTopicPosts(blockedMessage.length === 0 ? topicName : '');
  const navigation = useSquareSearchNavigation(() => undefined);

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + MIN_TOP_INSET }]}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.back}>
          <SymbolView
            name={{ ios: 'chevron.left', android: 'arrow_back_ios', web: 'arrow_back_ios' }}
            size={ICON_SIZE}
            tintColor={APP_TEXT_COLOR}
          />
        </Pressable>
        <Text style={styles.title} numberOfLines={1}>
          {topicName.length > 0 ? `${TOPIC_HASH}${topicName}` : ''}
        </Text>
      </View>
      <TopicPostList
        items={posts.items}
        blockedMessage={blockedMessage}
        isLoading={posts.isLoading}
        isError={posts.isError}
        isRefreshing={posts.isRefreshing}
        isFetchingMore={posts.isFetchingMore}
        onPressItem={navigation.handlePressItem}
        onLoadMore={posts.loadMore}
        onRefresh={() => {
          void posts.refresh();
        }}
        onRetry={() => {
          void posts.refresh();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: PAGE_SURFACE_COLOR,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: HEADER_MIN_HEIGHT,
    paddingHorizontal: 12,
    paddingBottom: 8,
    backgroundColor: PAGE_SURFACE_COLOR,
  },
  back: {
    width: 30,
    alignItems: 'center',
  },
  title: {
    flex: 1,
    marginLeft: 8,
    fontSize: 17,
    fontWeight: '700',
    color: APP_TEXT_COLOR,
  },
});
