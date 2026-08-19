import { Image } from 'expo-image';
import { useMemo } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import {
  APP_TEXT_COLOR,
  DEFAULT_THEME_COLOR,
  SUMMARY_NODE_IMAGES,
} from '@/src/features/soulFlower/constants';
import type { FlowerCardAnswerItem, ThemeColor } from '@/src/features/soulFlower/types';
import { groupAnswersByDate } from '@/src/features/soulFlower/utils/groupAnswers';

const NODE_SIZE = 22;

interface AwarenessSummaryProps {
  records: FlowerCardAnswerItem[];
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  themeColor: ThemeColor;
  flowerHex: string;
}

export function AwarenessSummary({
  records,
  isLoading,
  isError,
  onRetry,
  themeColor,
  flowerHex,
}: AwarenessSummaryProps) {
  const groups = useMemo(() => groupAnswersByDate(records), [records]);
  const nodeSource =
    SUMMARY_NODE_IMAGES[themeColor] ?? SUMMARY_NODE_IMAGES[DEFAULT_THEME_COLOR];

  return (
    <View style={styles.wrap}>
      <View style={styles.titleBlock}>
        <Text style={styles.title}>觉察总结</Text>
        <View style={[styles.titleLine, { backgroundColor: flowerHex }]} />
      </View>

      {isLoading ? <ActivityIndicator color={flowerHex} style={styles.status} /> : null}
      {isError ? (
        <Pressable onPress={onRetry} style={styles.status}>
          <Text style={styles.retry}>记录加载失败，点击重试</Text>
        </Pressable>
      ) : null}
      {!isLoading && !isError && groups.length === 0 ? (
        <Text style={styles.empty}>暂无觉察记录</Text>
      ) : null}

      {groups.map((group, groupIndex) => (
        <View key={group.dateKey} style={styles.row}>
          <View style={styles.timeline}>
            <Image source={nodeSource} style={styles.node} contentFit="contain" />
            {groupIndex === groups.length - 1 ? null : (
              <View style={[styles.vLine, { backgroundColor: flowerHex }]} />
            )}
          </View>
          <View style={styles.content}>
            <Text style={styles.date}>{group.dateLabel}</Text>
            {group.items.map((item) => (
              <View key={item.id} style={styles.qa}>
                <Text style={styles.question}>{item.questionTitle}</Text>
                <Text style={styles.answer}>
                  {item.summary?.trim() || item.answerContent}
                </Text>
              </View>
            ))}
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 40,
  },
  titleBlock: {
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: APP_TEXT_COLOR,
  },
  titleLine: {
    marginTop: 4,
    height: 2,
    width: 30,
  },
  status: {
    paddingVertical: 16,
  },
  retry: {
    color: '#64748B',
    fontSize: 14,
  },
  empty: {
    color: '#94A3B8',
    fontSize: 14,
  },
  row: {
    flexDirection: 'row',
    minHeight: 72,
  },
  timeline: {
    width: 28,
    alignItems: 'center',
  },
  node: {
    width: NODE_SIZE,
    height: NODE_SIZE,
    zIndex: 1,
  },
  vLine: {
    flex: 1,
    width: 1.5,
    marginTop: -2,
  },
  content: {
    flex: 1,
    paddingLeft: 10,
    paddingBottom: 18,
  },
  date: {
    fontSize: 15,
    fontWeight: '700',
    color: APP_TEXT_COLOR,
    marginBottom: 8,
  },
  qa: {
    marginBottom: 10,
    gap: 4,
  },
  question: {
    fontSize: 14,
    color: APP_TEXT_COLOR,
    lineHeight: 20,
  },
  answer: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 20,
  },
});
