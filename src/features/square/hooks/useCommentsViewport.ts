import { useCallback, useRef } from 'react';
import type { LayoutChangeEvent, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';

import {
  COMMENT_LOAD_MORE_OFFSET,
  COMMENTS_SCROLLED_SLACK,
} from '@/src/features/square/constants';

interface ScrollMetrics {
  offsetY: number;
  viewportHeight: number;
}

function isCommentsTopInViewport(commentsY: number, metrics: ScrollMetrics): boolean {
  if (metrics.viewportHeight <= 0) {
    return false;
  }
  return commentsY < metrics.offsetY + metrics.viewportHeight - COMMENTS_SCROLLED_SLACK;
}

export function useCommentsViewport(onNearEnd?: () => void) {
  const commentsYRef = useRef(0);
  const scrollMetricsRef = useRef<ScrollMetrics>({ offsetY: 0, viewportHeight: 0 });
  const isCommentsInViewRef = useRef(false);

  const refreshCommentsInView = useCallback(() => {
    isCommentsInViewRef.current = isCommentsTopInViewport(
      commentsYRef.current,
      scrollMetricsRef.current,
    );
  }, []);

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const { contentOffset, layoutMeasurement, contentSize } = event.nativeEvent;
      scrollMetricsRef.current = {
        offsetY: contentOffset.y,
        viewportHeight: layoutMeasurement.height,
      };
      refreshCommentsInView();
      if (
        onNearEnd &&
        contentOffset.y + layoutMeasurement.height >=
          contentSize.height - COMMENT_LOAD_MORE_OFFSET
      ) {
        onNearEnd();
      }
    },
    [onNearEnd, refreshCommentsInView],
  );

  const handleScrollViewLayout = useCallback(
    (event: LayoutChangeEvent) => {
      scrollMetricsRef.current.viewportHeight = event.nativeEvent.layout.height;
      refreshCommentsInView();
    },
    [refreshCommentsInView],
  );

  const handleCommentsLayoutY = useCallback(
    (y: number) => {
      commentsYRef.current = y;
      refreshCommentsInView();
    },
    [refreshCommentsInView],
  );

  const isCommentsInView = useCallback(() => {
    refreshCommentsInView();
    return isCommentsInViewRef.current;
  }, [refreshCommentsInView]);

  const getOffsetY = useCallback(() => scrollMetricsRef.current.offsetY, []);

  return {
    handleScroll,
    handleScrollViewLayout,
    handleCommentsLayoutY,
    isCommentsInView,
    getOffsetY,
  };
}
