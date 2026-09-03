import { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

import { CommentComposer } from '@/src/features/square/components/comments/CommentComposer';
import { CommentReplyPanel } from '@/src/features/square/components/comments/CommentReplyPanel';
import { CommentSection } from '@/src/features/square/components/comments/CommentSection';
import { StoryInlineComments } from '@/src/features/square/components/comments/StoryInlineComments';
import { SendFlowerModal } from '@/src/features/square/components/SendFlowerModal';
import { StoryActionBar } from '@/src/features/square/components/StoryActionBar';
import { StoryDetailBody } from '@/src/features/square/components/StoryDetailBody';
import { COMING_SOON_MESSAGE } from '@/src/features/square/constants';
import { useStoryDetailComments } from '@/src/features/square/hooks/useStoryDetailComments';
import type { SquareComment, Story } from '@/src/features/square/types';
import { showToast } from '@/src/utils/toast';

interface StoryDetailLoadedProps {
  storyId: string;
  story: Story;
}

const SCROLL_EVENT_THROTTLE = 16;

export function StoryDetailLoaded({ storyId, story }: StoryDetailLoadedProps) {
  const flow = useStoryDetailComments(storyId, story.commentCount);

  const handleStoryToggle = useCallback(
    (actionType: 'resonate' | 'collect') => {
      void flow.runAction({ targetType: 'story', targetId: storyId, actionType });
    },
    [flow, storyId],
  );

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
        onScroll={flow.handleScroll}>
        <StoryDetailBody story={story} />
        <StoryInlineComments
          comments={flow.comments}
          enableCollect
          enableFlower
          onReply={flow.openComposer}
          onViewReplies={flow.openReplyPanel}
          onResonate={flow.resonateComment}
          onCollect={flow.collectComment}
          onFlower={handleFlowerComment}
          onLayoutY={(y) => {
            flow.commentsYRef.current = y;
          }}
        />
      </KeyboardAwareScrollView>
      {flow.composerOpen ? (
        <CommentComposer
          ref={flow.composerRef}
          placeholder={flow.composerPlaceholder}
          isSubmitting={flow.comments.isSubmitting}
          onSubmit={flow.handleComposerSubmit}
        />
      ) : (
        <StoryActionBar
          resonateCount={story.resonateCount}
          collectCount={story.collectCount}
          flowerCount={story.flowerCount}
          commentCount={flow.displayCommentCount}
          isResonated={story.isResonated}
          isCollected={story.isCollected}
          onResonate={() => handleStoryToggle('resonate')}
          onCollect={() => handleStoryToggle('collect')}
          onFlower={() => flow.openFlowerModal({ targetType: 'story', targetId: storyId })}
          onComment={flow.handleCommentIcon}
          onShare={() => showToast(COMING_SOON_MESSAGE)}
        />
      )}
      <CommentSection
        visible={flow.sheetVisible}
        onClose={() => flow.setSheetVisible(false)}
        targetType="story"
        targetId={storyId}
        enableCollect
        enableFlower
        onCommentCountChange={flow.setCommentCount}
        onFlower={handleFlowerComment}
      />
      {flow.activeRoot ? (
        <CommentReplyPanel
          visible
          root={flow.activeRoot}
          isSubmitting={flow.comments.isSubmitting}
          enableCollect
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
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
});
