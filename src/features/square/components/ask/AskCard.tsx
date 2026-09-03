import { Image } from 'expo-image';
import { memo, useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { APP_TEXT_COLOR } from '@/constants/Colors';
import {
  ASK_ANSWERER_AVATAR_SIZE,
  ASK_CARD_PADDING,
  ASK_SUMMARY_EMPTY,
  MUTED_TEXT_COLOR,
} from '@/src/features/square/constants';
import type { Ask } from '@/src/features/square/types';
import { resolveCdnUrl } from '@/src/utils/cdn';

interface AskCardProps {
  ask: Ask;
  onPress: (askId: string) => void;
}

const TITLE_MAX_LINES = 2;
const SUMMARY_MAX_LINES = 2;

function AskCardComponent({ ask, onPress }: AskCardProps) {
  const avatarUri = resolveCdnUrl(ask.answererAvatar);
  const handlePress = useCallback(() => {
    onPress(ask.id);
  }, [ask.id, onPress]);

  return (
    <Pressable style={styles.card} onPress={handlePress}>
      <Text style={styles.title} numberOfLines={TITLE_MAX_LINES}>
        {ask.title}
      </Text>
      <Text style={styles.summary} numberOfLines={SUMMARY_MAX_LINES}>
        {ask.answerSummary ?? ASK_SUMMARY_EMPTY}
      </Text>
      <View style={styles.meta}>
        {avatarUri ? (
          <Image
            source={{ uri: avatarUri }}
            style={styles.avatar}
            contentFit="cover"
          />
        ) : (
          <View style={styles.avatar} />
        )}
        <Text style={styles.metaText}>
          {ask.answerCount}人回答 · {ask.viewCount}浏览
        </Text>
      </View>
    </Pressable>
  );
}

export const AskCard = memo(AskCardComponent);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: ASK_CARD_PADDING,
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
    color: APP_TEXT_COLOR,
  },
  summary: {
    fontSize: 13,
    lineHeight: 19,
    color: MUTED_TEXT_COLOR,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  avatar: {
    width: ASK_ANSWERER_AVATAR_SIZE,
    height: ASK_ANSWERER_AVATAR_SIZE,
    borderRadius: ASK_ANSWERER_AVATAR_SIZE / 2,
    backgroundColor: '#E2E8F0',
  },
  metaText: {
    fontSize: 12,
    color: MUTED_TEXT_COLOR,
  },
});
