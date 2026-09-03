import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, RefreshControl, StyleSheet, View } from 'react-native';

import { AskAnswerItem } from '@/src/features/square/components/ask/AskAnswerItem';
import { AskDetailOverlays } from '@/src/features/square/components/ask/AskDetailOverlays';
import { AskListStatus } from '@/src/features/square/components/ask/AskListStatus';
import { AskQuestionBody } from '@/src/features/square/components/ask/AskQuestionBody';
import { AskSortTabs } from '@/src/features/square/components/ask/AskSortTabs';
import { AskStickyBar } from '@/src/features/square/components/ask/AskStickyBar';
import {
  ACCENT_COLOR,
  ASK_ANSWER_EMPTY,
  ASK_DEFAULT_SORT,
  ASK_LIST_END_REACHED_THRESHOLD,
  COMING_SOON_MESSAGE,
  SQUARE_PAGE_BG,
} from '@/src/features/square/constants';
import { useAskAnswers } from '@/src/features/square/hooks/useAskAnswers';
import { useAskDetailFlow } from '@/src/features/square/hooks/useAskDetailFlow';
import type { Ask, AskAnswer, AskAnswerSort, SquareComment } from '@/src/features/square/types';
import { showToast } from '@/src/utils/toast';

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

  const handleAnswer = useCallback(() => {
    router.push(`/asks/${askId}/answer`);
  }, [askId, router]);

  const renderItem = useCallback(
    ({ item }: { item: AskAnswer }) => (
      <AskAnswerItem
        answer={item}
        onResonate={(id) => {
          void flow.runAction({ targetType: 'ask_answer', targetId: id, actionType: 'resonate' });
        }}
        onCollect={(id) => {
          void flow.runAction({ targetType: 'ask_answer', targetId: id, actionType: 'collect' });
        }}
        onFlower={(answer) =>
          flow.openFlower(
            { targetType: 'ask_answer', targetId: answer.id },
            answer.author.id,
          )
        }
        onComment={(answer) => flow.openComments(answer)}
        onShare={() => showToast(COMING_SOON_MESSAGE)}
        onReplyComment={(answer, comment) => flow.openComments(answer, comment)}
        onViewReplies={(answer, comment) => flow.openReplyPanel(answer, comment)}
        onResonateComment={flow.resonateComment}
        onFlowerComment={(comment: SquareComment) => {
          flow.openFlower(
            { targetType: 'comment', targetId: comment.id },
            comment.author.id,
          );
        }}
      />
    ),
    [flow],
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
              onCollect={() => {
                void flow.runAction({ targetType: 'ask', targetId: askId, actionType: 'collect' });
              }}
              onAnswer={handleAnswer}
              onInvite={() => flow.setInviteVisible(true)}
              onLayoutHeight={flow.setQuestionHeight}
            />
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
      <AskDetailOverlays flow={flow} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
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
