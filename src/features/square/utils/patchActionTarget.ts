import type {
  Ask,
  AskAnswer,
  Share,
  SquarePagedData,
  Story,
  ToggleActionResponse,
} from '@/src/features/square/types';

export function patchStory(story: Story, result: ToggleActionResponse): Story {
  return {
    ...story,
    resonateCount: result.resonateCount ?? story.resonateCount,
    isResonated: result.isResonated ?? story.isResonated,
    collectCount: result.collectCount ?? story.collectCount,
    isCollected: result.isCollected ?? story.isCollected,
    flowerCount: result.flowerCount ?? story.flowerCount,
    isFlowered: result.isFlowered ?? story.isFlowered,
  };
}

export function patchShare(share: Share, result: ToggleActionResponse): Share {
  return {
    ...share,
    resonateCount: result.resonateCount ?? share.resonateCount,
    isResonated: result.isResonated ?? share.isResonated,
    collectCount: result.collectCount ?? share.collectCount,
    isCollected: result.isCollected ?? share.isCollected,
    flowerCount: result.flowerCount ?? share.flowerCount,
    isFlowered: result.isFlowered ?? share.isFlowered,
  };
}

export function patchAsk(ask: Ask, result: ToggleActionResponse): Ask {
  return {
    ...ask,
    resonateCount: result.resonateCount ?? ask.resonateCount,
    isResonated: result.isResonated ?? ask.isResonated,
    collectCount: result.collectCount ?? ask.collectCount,
    isCollected: result.isCollected ?? ask.isCollected,
    flowerCount: result.flowerCount ?? ask.flowerCount,
    isFlowered: result.isFlowered ?? ask.isFlowered,
  };
}

export function patchAskAnswer(answer: AskAnswer, result: ToggleActionResponse): AskAnswer {
  return {
    ...answer,
    resonateCount: result.resonateCount ?? answer.resonateCount,
    isResonated: result.isResonated ?? answer.isResonated,
    collectCount: result.collectCount ?? answer.collectCount,
    isCollected: result.isCollected ?? answer.isCollected,
    flowerCount: result.flowerCount ?? answer.flowerCount,
    isFlowered: result.isFlowered ?? answer.isFlowered,
  };
}

export function patchPagedItems<T extends { id: string }>(
  data: { pages: SquarePagedData<T>[]; pageParams: unknown[] } | undefined,
  id: string,
  patchItem: (item: T) => T,
): { pages: SquarePagedData<T>[]; pageParams: unknown[] } | undefined {
  if (!data) {
    return data;
  }
  return {
    ...data,
    pages: data.pages.map((page) => ({
      ...page,
      items: page.items.map((item) => (item.id === id ? patchItem(item) : item)),
    })),
  };
}
