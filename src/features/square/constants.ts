import type { AskAnswerSort, ShareVisibleRange, SquareSubTabId } from "./types";

export const SQUARE_PAGE_SIZE = 20;

export const STORY_SUMMARY_MAX_LENGTH = 100;

export const FLOWER_QUANTITY_MIN = 1;

export const FLOWER_QUANTITY_MAX = 99;

export const GIFT_FLOWER_THUMB_SIZE = 56;

export const GIFT_FLOWER_GRID_MAX_HEIGHT = 240;

export const GIFT_FLOWER_SEND_TITLE = "送花";

export const GIFT_FLOWER_SHOP_TITLE = "购买礼物花";

export const GIFT_FLOWER_COIN_LABEL = "花币";

export const GIFT_FLOWER_BUY_ENTRY = "去购买";

export const GIFT_FLOWER_SEND_ACTION = "赠送";

export const GIFT_FLOWER_PURCHASE_ACTION = "购买";

export const GIFT_FLOWER_EMPTY_INVENTORY = "暂无可赠送的花，请先购买";

export const GIFT_FLOWER_RECEIVED_HINT = "获赠的花不可转赠";

export const GIFT_FLOWER_SEND_SUCCESS = "赠送成功";

export const GIFT_FLOWER_PURCHASE_SUCCESS = "购买成功";

export const FLOWER_LEDGER_PAGE_SIZE = 20;

export const FLOWER_LEDGER_TITLE = "把温柔送给TA";

export const FLOWER_LEDGER_SUBTITLE = "你的一朵花，是一个暖心的陪伴";

export const FLOWER_LEDGER_SEND_LABEL = "❀ 送花";

export const FLOWER_LEDGER_COUNT_PREFIX = "已送花";

export const FLOWER_LEDGER_COUNT_SUFFIX = "朵";

export const FLOWER_LEDGER_MODAL_TITLE = "送花记录";

export const FLOWER_LEDGER_EMPTY = "暂无送花记录";

export const FLOWER_LEDGER_LOAD_ERROR = "送花记录加载失败";

export const FLOWER_LEDGER_AVATAR_SIZE = 28;

export const FLOWER_LEDGER_AVATAR_GAP = 4;

export const FLOWER_LEDGER_CHEVRON_SIZE = 22;

export const FLOWER_LEDGER_ROW_FLOWER_SIZE = 36;

export const FLOWER_LEDGER_SEND_GRADIENT = ["#C026D3", "#E11D48"] as const;

export const GIFT_FLOWER_LEDGERS_QUERY_ROOT = [
  "square",
  "giftFlowerLedgers",
] as const;

export const TOP_REPLIES_PREVIEW_COUNT = 2;

export const COMMENT_LONG_PRESS_DELAY_MS = 350;

export const COMMENT_SECTION_TITLE = "评论";

export const COMMENT_ALL_TITLE = "全部评论";

export const COMMENT_REPLIES_TITLE = "评论回复";

export const COMMENT_SHEET_HEIGHT_RATIO = 0.8;

export const COMMENT_ROOT_DIVIDER_HEIGHT = 8;

export const COMMENT_REPLIES_COUNT_PREFIX = "回复 ";

export const COMMENT_HORIZONTAL_PADDING = 16;

export const COMMENTS_SCROLLED_SLACK = 80;

export const COMMENT_LOAD_MORE_OFFSET = 160;

export const COMPOSER_FOCUS_DELAY_MS = 80;

export const COMPOSER_OPEN_GUARD_MS = 400;

export const COMMENT_COMPOSER_PLACEHOLDER = "说点什么…";

export const ANONYMOUS_DISPLAY_NAME = "匿名用户";

export const ALL_TOPIC_CATEGORY = "all";

export const COMING_SOON_MESSAGE = "功能开发中";

export const SQUARE_PAGE_BG = "#F8FAFC";

export const PAGE_SURFACE_COLOR = "#FFFFFF";

export const ASK_SECTION_DIVIDER_HEIGHT = 6;

export const MUTED_TEXT_COLOR = "#64748B";

export const PLACEHOLDER_TEXT_COLOR = "#94A3B8";

export const SEARCH_BAR_BG = "#F1F5F9";

export const SEARCH_PLACEHOLDER = "搜索故事、分享、问答";

export const SEARCH_EMPTY_HINT = "输入关键词搜索故事、分享、问答";

export const SEARCH_NO_RESULT = "没有找到相关内容";

export const SEARCH_LOAD_ERROR = "搜索失败，请稍后重试";

export const SEARCH_PAGE_SIZE = 10;

export const SEARCH_TITLE_MAX_LINES = 2;

export const SEARCH_CONTENT_MAX_LINES = 3;

export const SEARCH_TYPE_LABELS: Record<SquareSubTabId, string> = {
  story: "故事",
  share: "分享",
  ask: "问答",
};

export const CARD_BORDER_COLOR = "#EEEFF3";

export const ACCENT_COLOR = "#7B6CF9";

export const DANGER_TEXT_COLOR = "#DC2626";

export const COMMENT_HIGHLIGHT_COLOR = "#6F72F1";

export const STORY_LIST_MIN_COLUMNS = 2;

export const STORY_LIST_MIN_COLUMN_WIDTH = 300;

export const STORY_LIST_COLUMN_GAP = 8;

export const STORY_LIST_HORIZONTAL_PADDING = 12;

export const STORY_TITLE_MAX_LENGTH = 60;

export const STORY_CONTENT_MAX_LENGTH = 2000;

export const SHARE_CONTENT_MAX_LENGTH = 500;

export const SHARE_IMAGE_MAX_COUNT = 9;

export const SHARE_AVATAR_SIZE = 50;

export const SHARE_SIDEBAR_WIDTH = 64;

export const SHARE_COMPACT_COMMENT_COUNT = 2;

export const DEFAULT_AUTHOR_LEVEL = 1;

export const SHARE_DEFAULT_VISIBLE_RANGE: ShareVisibleRange = "public";

export const SHARE_LIST_BG = "#FFFFFF";

export const SHARE_ITEM_PADDING_H = 16;

export const SHARE_ITEM_PADDING_V = 14;

export const SHARE_BODY_GAP = 8;

export const SHARE_IMAGE_GAP = 4;

export const SHARE_IMAGE_RADIUS = 6;

export const SHARE_SINGLE_IMAGE_MAX_HEIGHT = 220;

export const SHARE_FOUR_IMAGE_COUNT = 4;

export const SHARE_FOUR_GRID_COLUMNS = 2;

export const SHARE_PREVIEW_BG = "#0F172A";

export const SHARE_DEFAULT_GRID_COLUMNS = 3;

export const SHARE_DIVIDER_WIDTH = 1;

export const SHARE_NAME_ROW_GAP = 6;

export const SHARE_UPLOAD_GRID_GAP = 8;

export const SHARE_UPLOAD_THUMB_SIZE = 88;

export const SHARE_LIST_END_REACHED_THRESHOLD = 0.4;

export const SHARE_CONTENT_MIN_HEIGHT = 120;

export const SHARE_ACTION_LIKE_LABEL = "点赞";

export const SHARE_ACTION_COMMENT_LABEL = "评论";

export const SHARE_ACTION_FLOWER_LABEL = "送花";

export const SHARE_EXPAND_COMMENTS_LABEL = "展开更多评论";

export const SHARE_COLLAPSE_COMMENTS_LABEL = "收起评论";

export const SHARE_LOAD_MORE_COMMENTS_LABEL = "加载更多评论";

export const SHARE_PUBLISH_TITLE = "分享";

export const SHARE_CONTENT_PLACEHOLDER = "分享这一刻…";

export const SHARE_VISIBLE_RANGE_LABEL = "可见范围";

export const SHARE_TOPIC_OPTIONAL_LABEL = "话题标签（选填）";

export const SHARE_IMAGE_UPLOAD_LABEL = "添加图片";

export const SHARE_IMAGE_PREVIEW_TITLE = "图片";

export const SHARE_LIST_EMPTY_MESSAGE = "暂无分享";

export const ASK_TITLE_MAX_LENGTH = 100;

export const ASK_CONTENT_MAX_LENGTH = 2000;

export const ASK_ANSWER_MAX_LENGTH = 2000;

export const ASK_CONTENT_MIN_HEIGHT = 120;

export const ASK_ANSWER_MIN_HEIGHT = 180;

export const ASK_REPLY_EXPAND_COUNT = 5;

export const ASK_STICKY_SLACK = 12;

export const ASK_GO_ANSWER_LABEL = "去回答";

export const ASK_INVITE_LABEL = "邀请回答";

export const ASK_PUBLISH_TITLE = "提问";

export const ASK_PUBLISH_TIPS_HEADING = "如何更好提问";

export const ASK_PUBLISH_TIPS = [
  {
    id: "clear",
    title: "表达清楚",
    description: "用一句完整的话说清你最想问的问题",
  },
  {
    id: "context",
    title: "带上关键信息",
    description: "把必要的对象、场景或限制写进问题里",
  },
  {
    id: "focus",
    title: "聚焦问题",
    description: "一次只问一个核心问题，更容易获得有效回答",
  },
] as const;

export const ASK_TIP_ICON_BG = "#E8EAF3";

export const ASK_TIP_DESC_COLOR = "#8A84B5";

export const ASK_ANSWER_PUBLISH_TITLE = "写回答";

export const ASK_LIST_EMPTY_MESSAGE = "暂无问答";

export const ASK_SORT_HOT_LABEL = "最热";

export const ASK_SORT_LATEST_LABEL = "最新";

export const ASK_DEFAULT_SORT: AskAnswerSort = "hot";

export const ASK_SORT_OPTIONS: { id: AskAnswerSort; label: string }[] = [
  { id: "hot", label: ASK_SORT_HOT_LABEL },
  { id: "latest", label: ASK_SORT_LATEST_LABEL },
];

export const ASK_INVITE_TITLE = "邀请回答";

export const ASK_INVITE_EMPTY = "暂无可邀请的好友";

export const ASK_INVITE_ACTION = "邀请";

export const ASK_INVITE_DONE = "已邀请";

export const ASK_INVITE_COPY_HINT = "分享到站外";

export const ASK_INVITE_FOLLOWING_TITLE = "邀请关注的人";

export const ASK_ANSWER_COUNT_SUFFIX = "条回答";

export const ASK_VIEW_ALL_ANSWERS_LABEL = "查看全部回答";

export const ASK_ANSWER_DETAIL_ERROR = "回答加载失败";

export const ASK_ANSWER_EMPTY = "暂无回答，来写第一条吧";

export const ASK_COLLECT_LABEL = "收藏";

export const ASK_SHARE_LABEL = "分享";

export const SHARE_SHEET_COPY_LINK = "复制链接";

export const SHARE_SHEET_COPY_SUCCESS = "链接已复制";

export const SHARE_SHEET_COPY_FAIL = "复制失败";

export const ASK_ANSWER_SUBMIT_LABEL = "提交";

export const ASK_COMMENT_PREVIEW_INDENT = 46;

export const ASK_SUMMARY_EMPTY = "暂无回答";

export const ASK_VIEW_ALL_REPLIES_LABEL = "查看全部回复";

export const ASK_LIST_END_REACHED_THRESHOLD = 0.4;

export const ASK_ANSWERER_AVATAR_SIZE = 28;

export const ASK_CARD_PADDING = 12;

export const SHARE_VISIBLE_RANGE_OPTIONS: {
  id: ShareVisibleRange;
  label: string;
}[] = [
  { id: "public", label: "公开" },
  { id: "friends", label: "好友可见" },
  { id: "private", label: "仅自己" },
];

export const STORY_TOPIC_TABS = [
  { id: ALL_TOPIC_CATEGORY, name: "全部" },
  { id: "婚恋", name: "婚恋" },
  { id: "职场", name: "职场" },
  { id: "亲子", name: "亲子" },
  { id: "成长", name: "成长" },
  { id: "人际", name: "人际" },
  { id: "家庭", name: "家庭" },
  { id: "其他", name: "其他" },
] as const;

export const STORY_TOPIC_OPTIONS = STORY_TOPIC_TABS.filter(
  (tab) => tab.id !== ALL_TOPIC_CATEGORY,
);

export const SQUARE_SUB_TABS: { id: SquareSubTabId; label: string }[] = [
  { id: "story", label: "故事" },
  { id: "share", label: "分享" },
  { id: "ask", label: "问答" },
];

export const PUBLISH_MENU_ITEMS = [
  { id: "story", label: "投稿" },
  { id: "share", label: "分享" },
  { id: "ask", label: "提问" },
] as const;

export const SQUARE_QUERY_KEYS = {
  stories: (category: string) => ["square", "stories", category] as const,
  storyDetail: (id: string) => ["square", "story", id] as const,
  comments: (targetType: string, targetId: string) =>
    ["square", "comments", targetType, targetId] as const,
  commentReplies: (rootId: string) =>
    ["square", "commentReplies", rootId] as const,
  giftFlowerInventory: ["square", "giftFlowerInventory"] as const,
  giftFlowerCatalog: ["square", "giftFlowers"] as const,
  giftFlowerLedgers: (targetType: string, targetId: string) =>
    [...GIFT_FLOWER_LEDGERS_QUERY_ROOT, targetType, targetId] as const,
  shares: ["square", "shares"] as const,
  asks: ["square", "asks"] as const,
  askDetail: (id: string) => ["square", "ask", id] as const,
  askAnswerDetail: (id: string) => ["square", "askAnswer", id] as const,
  askAnswers: (id: string, sort: string) =>
    ["square", "askAnswers", id, sort] as const,
  search: (keyword: string) => ["square", "search", keyword] as const,
};
