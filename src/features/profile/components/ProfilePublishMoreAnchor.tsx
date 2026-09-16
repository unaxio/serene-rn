import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';

import { PROFILE_QUERY_KEYS } from '@/src/features/profile/constants';
import { ContentMoreButton } from '@/src/features/square/components/ContentMoreButton';
import { ContentMoreOverlays } from '@/src/features/square/components/ContentMoreOverlays';
import { useContentMoreController } from '@/src/features/square/hooks/useContentMoreController';
import type { Share } from '@/src/features/square/types';
import type { ContentMoreKind } from '@/src/features/square/utils/contentMoreActions';

interface ProfilePublishMoreAnchorProps {
  contentKind: ContentMoreKind;
  targetId: string;
  authorId?: string | null;
  shareSnapshot?: Share | null;
}

const MORE_ICON_SIZE = 18;

export function ProfilePublishMoreAnchor({
  contentKind,
  targetId,
  authorId = null,
  shareSnapshot = null,
}: ProfilePublishMoreAnchorProps) {
  const queryClient = useQueryClient();

  const handleDeleted = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: ['profile', 'me', 'contents'] });
    void queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEYS.home });
  }, [queryClient]);

  const more = useContentMoreController({
    contentKind,
    targetId,
    authorId,
    shareSnapshot,
    onDeleted: handleDeleted,
  });

  return (
    <View style={styles.wrap}>
      <ContentMoreButton vertical size={MORE_ICON_SIZE} onPress={more.openMenu} />
      <ContentMoreOverlays controller={more} contentKind={contentKind} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    zIndex: 2,
  },
});
