import { memo, useCallback, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { APP_TEXT_COLOR } from '@/constants/Colors';
import { ShareCompactComments } from '@/src/features/square/components/share/ShareCompactComments';
import { ShareImageGrid } from '@/src/features/square/components/share/ShareImageGrid';
import { ShareItemActions } from '@/src/features/square/components/share/ShareItemActions';
import { SquareUserAvatar } from '@/src/features/square/components/SquareUserAvatar';
import { TopicTag } from '@/src/features/square/components/TopicTag';
import {
  CARD_BORDER_COLOR,
  SHARE_AVATAR_SIZE,
  SHARE_BODY_GAP,
  SHARE_DIVIDER_WIDTH,
  SHARE_ITEM_PADDING_H,
  SHARE_ITEM_PADDING_V,
  SHARE_NAME_ROW_GAP,
  SHARE_SIDEBAR_WIDTH,
} from '@/src/features/square/constants';
import type { Share } from '@/src/features/square/types';
import {
  getAuthorDisplayName,
  getAuthorLevelLabel,
} from '@/src/features/square/utils/displayAuthor';
import { resolveCdnUrl } from '@/src/utils/cdn';

interface ShareItemProps {
  share: Share;
  onResonate: (shareId: string) => void;
  onFlower: (share: Share) => void;
  onPreviewImages: (uris: string[], index: number) => void;
}

function ShareItemInner({
  share,
  onResonate,
  onFlower,
  onPreviewImages,
}: ShareItemProps) {
  const [expanded, setExpanded] = useState(false);
  const [showComposer, setShowComposer] = useState(false);
  const previewUris = useMemo(
    () => share.images.map((path) => resolveCdnUrl(path)).filter((uri): uri is string => Boolean(uri)),
    [share.images],
  );

  const handlePreview = useCallback(
    (index: number) => {
      onPreviewImages(previewUris, index);
    },
    [onPreviewImages, previewUris],
  );

  return (
    <View style={styles.row}>
      <View style={styles.sidebar}>
        <SquareUserAvatar author={share.author} size={SHARE_AVATAR_SIZE} />
      </View>
      <View style={styles.body}>
        <View style={styles.nameRow}>
          <Text style={styles.name} numberOfLines={1}>
            {getAuthorDisplayName(share.author)}
          </Text>
          <TopicTag label={getAuthorLevelLabel(share.author)} />
        </View>
        {share.topicTag ? <TopicTag label={share.topicTag} /> : null}
        {share.content.trim().length > 0 ? (
          <Text style={styles.content}>{share.content}</Text>
        ) : null}
        <ShareImageGrid images={share.images} onPress={handlePreview} />
        <ShareItemActions
          resonateCount={share.resonateCount}
          commentCount={share.commentCount}
          flowerCount={share.flowerCount}
          isResonated={share.isResonated}
          onResonate={() => onResonate(share.id)}
          onComment={() => {
            setShowComposer(true);
            setExpanded(true);
          }}
          onFlower={() => onFlower(share)}
        />
        <ShareCompactComments
          shareId={share.id}
          commentCount={share.commentCount}
          expanded={expanded}
          showComposer={showComposer}
          onToggleExpanded={() => setExpanded((value) => !value)}
        />
      </View>
    </View>
  );
}

export const ShareItem = memo(ShareItemInner);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: SHARE_ITEM_PADDING_H,
    paddingVertical: SHARE_ITEM_PADDING_V,
    borderBottomWidth: SHARE_DIVIDER_WIDTH,
    borderBottomColor: CARD_BORDER_COLOR,
  },
  sidebar: {
    width: SHARE_SIDEBAR_WIDTH,
    alignItems: 'center',
  },
  body: {
    flex: 1,
    gap: SHARE_BODY_GAP,
    minWidth: 0,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SHARE_NAME_ROW_GAP,
  },
  name: {
    flexShrink: 1,
    fontSize: 15,
    fontWeight: '600',
    color: APP_TEXT_COLOR,
  },
  content: {
    fontSize: 15,
    lineHeight: 22,
    color: APP_TEXT_COLOR,
  },
});
