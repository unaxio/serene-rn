import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

import { AskAnswerItem } from '@/src/features/square/components/ask/AskAnswerItem';
import { AskAnswerQuestionHeader } from '@/src/features/square/components/ask/AskAnswerQuestionHeader';
import { CommentComposer } from '@/src/features/square/components/comments/CommentComposer';
import { CommentComposerLayer } from '@/src/features/square/components/comments/CommentComposerLayer';
import { CommentReplyPanel } from '@/src/features/square/components/comments/CommentReplyPanel';
import { StoryInlineComments } from '@/src/features/square/components/comments/StoryInlineComments';
import { SendFlowerModal } from '@/src/features/square/components/SendFlowerModal';
import { SquareShareSheet } from '@/src/features/square/components/SquareShareSheet';
import { PAGE_SURFACE_COLOR } from '@/src/features/square/constants';
import { useStoryDetailComments } from '@/src/features/square/hooks/useStoryDetailComments';
import type { AskAnswerDetail, SquareComment } from '@/src/features/square/types';

interface AskAnswerDetailLoadedProps {
  detail: AskAnswerDetail;
}

const SCROLL_EVENT_THROTTLE = 16;

export function AskAnswerDetailLoaded({ detail }: AskAnswerDetailLoadedProps) {
  const router = useRouter();
  const flow = useStoryDetailComments(detail.id, detail.commentCount, 'ask_answer');
  const [shareVisible, setShareVisible] = useState(false);

  const openAsk = useCallback(() => {
    router.push(`/asks/${detail.ask.id}`);
  }, [detail.ask.id, router]);

  const handleFlowerComment = useCallback(
    (comment: SquareComment) => {
      flow.openFlowerModal({ targetType: 'comment', targetId: comment.id });
    },
    [flow],
  );

  return (
    <View style={styles.root}>
      <KeyboardAwareScrollView
        style={styles.scroll}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        scrollEventThrottle={SCROLL_EVENT_THROTTLE}
        onScroll={flow.handleScroll}
        onLayout={flow.handleScrollViewLayout}>
        <AskAnswerQuestionHeader ask={detail.ask} onOpenAsk={openAsk} />
        <AskAnswerItem
          answer={{ ...detail, commentCount: flow.displayCommentCount }}
          onResonate={(id) => {
            void flow.runAction({
              targetType: 'ask_answer',
              targetId: id,
              actionType: 'resonate',
            });
          }}
          onCollect={(id) => {
            void flow.runAction({
              targetType: 'ask_answer',
              targetId: id,
              actionType: 'collect',
            });
          }}
          onFlower={(answer) =>
            flow.openFlowerModal({
              targetType: 'ask_answer',
              targetId: answer.id,
            })
          }
          onComment={() => flow.openComposer(null)}
          onShare={() => setShareVisible(true)}
        />
        <StoryInlineComments
          comments={flow.comments}
          enableCollect={false}
          enableFlower
          onReply={flow.openComposer}
          onViewReplies={flow.openReplyPanel}
          onResonate={flow.resonateComment}
          onCollect={flow.collectComment}
          onFlower={handleFlowerComment}
          onLayoutY={flow.handleCommentsLayoutY}
        />
      </KeyboardAwareScrollView>
      <CommentComposerLayer visible={flow.composerOpen} onDismiss={flow.closeComposer}>
        <CommentComposer
          ref={flow.composerRef}
          placeholder={flow.composerPlaceholder}
          isSubmitting={flow.comments.isSubmitting}
          onSubmit={flow.handleComposerSubmit}
        />
      </CommentComposerLayer>
      {flow.activeRoot ? (
        <CommentReplyPanel
          visible
          root={flow.activeRoot}
          isSubmitting={flow.comments.isSubmitting}
          enableFlower
          onClose={() => flow.setActiveRoot(null)}
          onResonate={flow.resonateComment}
          onCollect={flow.collectComment}
          onFlower={handleFlowerComment}
          onSubmitReply={flow.handleReplyToRoot}
        />
      ) : null}
      <SendFlowerModal
        visible={flow.flowerTarget !== null}
        isSubmitting={flow.isPending}
        onClose={() => flow.setFlowerTarget(null)}
        onSubmit={flow.handleSendFlower}
      />
      <SquareShareSheet
        visible={shareVisible}
        path={`/ask-answers/${detail.id}`}
        onClose={() => setShareVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: PAGE_SURFACE_COLOR,
  },
  scroll: {
    flex: 1,
  },
});
