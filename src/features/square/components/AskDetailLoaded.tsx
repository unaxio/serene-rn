import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, RefreshControl, StyleSheet, View } from 'react-native';

import { AskActionBar } from '@/src/features/square/components/ask/AskActionBar';
import { AskAnswerItem } from '@/src/features/square/components/ask/AskAnswerItem';
import { AskDetailOverlays } from '@/src/features/square/components/ask/AskDetailOverlays';
import { AskListStatus } from '@/src/features/square/components/ask/AskListStatus';
import { AskQuestionBody } from '@/src/features/square/components/ask/AskQuestionBody';
import { AskSortTabs } from '@/src/features/square/components/ask/AskSortTabs';
import { AskStickyBar } from '@/src/features/square/components/ask/AskStickyBar';
import { SquareShareSheet } from '@/src/features/square/components/SquareShareSheet';
import {
  ACCENT_COLOR,
  ASK_ANSWER_EMPTY,
  ASK_DEFAULT_SORT,
  ASK_LIST_END_REACHED_THRESHOLD,
  ASK_SECTION_DIVIDER_HEIGHT,
  SQUARE_PAGE_BG,
} from '@/src/features/square/constants';
import { useAskAnswers } from '@/src/features/square/hooks/useAskAnswers';
import { useAskDetailFlow } from '@/src/features/square/hooks/useAskDetailFlow';
import type { Ask, AskAnswer, AskAnswerSort } from '@/src/features/square/types';

interface AskDetailLoadedProps {
  askId: string;
  ask: Ask;
}

const SCROLL_EVENT_THROTTLE = 16;

export function AskDetailLoaded({ askId, ask }: AskDetailLoadedProps) {
  const router = useRouter();
  const flow = useAskDetailFlow();
  const [sort, setSort] = useState<AskAnswerSort>(ASK_DEFAULT_SORT);
  const answers = useAskAnswers(askId, sort);
  const [shareVisible, setShareVisible] = useState(false);

  const handleAnswer = useCallback(() => {
    router.push(`/asks/${askId}/answer`);
  }, [askId, router]);

  const openAnswerDetail = useCallback(
    (answerId: string) => {
      router.push(`/ask-answers/${answerId}`);
    },
    [router],
  );

  const renderItem = useCallback(
    ({ item }: { item: AskAnswer }) => (
      <AskAnswerItem
        answer={item}
        onPress={() => openAnswerDetail(item.id)}
        onResonate={(id) => {
          void flow.runAction({ targetType: 'ask_answer', targetId: id, actionType: 'resonate' });
        }}
        onCollect={(id) => {
          void flow.runAction({ targetType: 'ask_answer', targetId: id, actionType: 'collect' });
        }}
        onFlower={(answer) =>
          flow.openFlower({ targetType: 'ask_answer', targetId: answer.id })
        }
        onComment={(answer) => openAnswerDetail(answer.id)}
        onShare={() => setShareVisible(true)}
      />
    ),
    [flow, openAnswerDetail],
  );

  return (
    <View style={styles.root}>
      <FlashList
        data={answers.items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        onEndReached={answers.loadMore}
        onEndReachedThreshold={ASK_LIST_END_REACHED_THRESHOLD}
        scrollEventThrottle={SCROLL_EVENT_THROTTLE}
        onScroll={flow.handleScroll}
        refreshControl={
          <RefreshControl
            refreshing={answers.isRefreshing}
            tintColor={ACCENT_COLOR}
            onRefresh={() => {
              void answers.refresh();
            }}
          />
        }
        ListHeaderComponent={
          <View>
            <AskQuestionBody
              ask={ask}
              onAnswer={handleAnswer}
              onInvite={() => flow.setInviteVisible(true)}
              onLayoutHeight={flow.setQuestionHeight}
            />
            <View style={styles.sectionDivider} />
            <AskSortTabs value={sort} onChange={setSort} />
          </View>
        }
        ListEmptyComponent={
          answers.isLoading ? (
            <ActivityIndicator style={styles.status} color={ACCENT_COLOR} />
          ) : answers.isError ? (
            <AskListStatus message="回答加载失败" onRetry={() => void answers.refresh()} />
          ) : (
            <AskListStatus message={ASK_ANSWER_EMPTY} />
          )
        }
        ListFooterComponent={
          answers.isFetchingMore ? <ActivityIndicator style={styles.footer} color={ACCENT_COLOR} /> : null
        }
      />
      {flow.stickyVisible ? (
        <View style={styles.sticky}>
          <AskStickyBar title={ask.title} onAnswer={handleAnswer} />
        </View>
      ) : null}
      <AskActionBar
        resonateCount={ask.resonateCount}
        flowerCount={ask.flowerCount}
        collectCount={ask.collectCount}
        isResonated={ask.isResonated}
        isCollected={ask.isCollected}
        isFlowered={ask.isFlowered}
        onResonate={() => {
          void flow.runAction({ targetType: 'ask', targetId: askId, actionType: 'resonate' });
        }}
        onFlower={() => flow.openFlower({ targetType: 'ask', targetId: askId })}
        onShare={() => setShareVisible(true)}
        onCollect={() => {
          void flow.runAction({ targetType: 'ask', targetId: askId, actionType: 'collect' });
        }}
      />
      <AskDetailOverlays flow={flow} askId={askId} />
      <SquareShareSheet
        visible={shareVisible}
        path={`/asks/${askId}`}
        onClose={() => setShareVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: SQUARE_PAGE_BG,
  },
  sectionDivider: {
    height: ASK_SECTION_DIVIDER_HEIGHT,
    backgroundColor: SQUARE_PAGE_BG,
  },
  sticky: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 2,
  },
  status: {
    paddingVertical: 32,
  },
  footer: {
    paddingVertical: 16,
  },
});
