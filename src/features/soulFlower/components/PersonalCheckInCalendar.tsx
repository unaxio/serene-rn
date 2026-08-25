import { SymbolView } from 'expo-symbols';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { LayoutChangeEvent, Pressable, StyleSheet, Text, View } from 'react-native';

import { UseLightCardConfirmModal } from '@/src/features/soulFlower/components/UseLightCardConfirmModal';
import { SimpleTipModal } from '@/src/features/soulFlower/components/SimpleTipModal';
import { APP_TEXT_COLOR } from '@/src/features/soulFlower/constants';
import { useUseLightCard } from '@/src/features/soulFlower/hooks/useUseLightCard';
import {
  buildMonthGrid,
  compareYearMonth,
  formatYearMonthLabel,
  getConsecutiveRuns,
  getMonthBoundsFromDateKeys,
  shiftYearMonth,
  toYearMonth,
  type YearMonth,
} from '@/src/features/soulFlower/utils/checkInCalendar';

interface PersonalCheckInCalendarProps {
  answeredDateKeys: Set<string>;
  lightCardDateKeys: Set<string>;
  lightCardCount: number;
  /** 是否允许点击空日期补签，默认 true */
  enableMakeup?: boolean;
  /** 月份切换可用范围；默认 answered ∪ light */
  navigationDateKeys?: Set<string>;
  /** 自己已打卡日期（不可再补签）；默认 answered ∪ light */
  myMarkedDateKeys?: Set<string>;
}

const WEEKDAY_LABELS = ['日', '一', '二', '三', '四', '五', '六'] as const;
const DAY_MARK_SIZE = 24;
const CHECKED_BG = '#efedfd';
const LIGHT_CARD_BG = '#f89d34';
const DIVIDER_COLOR = '#F1F5F9';
const DISABLED_ARROW = '#CBD5E1';
const CELL_HEIGHT = 36;
const WEEK_COLUMN_COUNT = 7;

function getTodayDateKey(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
}

function formatDateLabel(dateKey: string): string {
  const [year, month, day] = dateKey.split('-');
  return `${year}年${Number(month)}月${Number(day)}日`;
}

export function PersonalCheckInCalendar({
  answeredDateKeys,
  lightCardDateKeys,
  lightCardCount,
  enableMakeup = true,
  navigationDateKeys,
  myMarkedDateKeys,
}: PersonalCheckInCalendarProps) {
  const allMarkedKeys = useMemo(() => {
    const set = new Set(answeredDateKeys);
    lightCardDateKeys.forEach((key) => set.add(key));
    return set;
  }, [answeredDateKeys, lightCardDateKeys]);

  const boundsSourceKeys = navigationDateKeys ?? allMarkedKeys;
  const myKeys = myMarkedDateKeys ?? allMarkedKeys;

  const bounds = useMemo(
    () => getMonthBoundsFromDateKeys(Array.from(boundsSourceKeys)),
    [boundsSourceKeys],
  );

  const [visibleMonth, setVisibleMonth] = useState<YearMonth>(() =>
    toYearMonth(new Date()),
  );
  const [rowWidth, setRowWidth] = useState(0);
  const [pendingDateKey, setPendingDateKey] = useState<string | null>(null);
  const [tipMessage, setTipMessage] = useState<string | null>(null);
  const { useForDate, isPending } = useUseLightCard();

  useEffect(() => {
    setVisibleMonth((current) => {
      if (compareYearMonth(current, bounds.min) < 0) {
        return bounds.min;
      }
      if (compareYearMonth(current, bounds.max) > 0) {
        return bounds.max;
      }
      return current;
    });
  }, [bounds.max, bounds.min]);

  const canGoPrev = compareYearMonth(visibleMonth, bounds.min) > 0;
  const canGoNext = compareYearMonth(visibleMonth, bounds.max) < 0;
  const todayKey = getTodayDateKey();

  const rows = useMemo(
    () => buildMonthGrid(visibleMonth, answeredDateKeys, lightCardDateKeys),
    [answeredDateKeys, lightCardDateKeys, visibleMonth],
  );

  const handleRowLayout = (event: LayoutChangeEvent) => {
    setRowWidth(event.nativeEvent.layout.width);
  };

  const cellWidth = rowWidth > 0 ? rowWidth / WEEK_COLUMN_COUNT : 0;

  const canPressDate = useCallback(
    (dateKey: string) => {
      if (!enableMakeup || dateKey > todayKey) {
        return false;
      }
      return !myKeys.has(dateKey);
    },
    [enableMakeup, myKeys, todayKey],
  );

  const handlePressDay = useCallback(
    (dateKey: string) => {
      if (!canPressDate(dateKey)) {
        return;
      }
      if (!(lightCardCount > 0)) {
        setTipMessage('没有续光卡');
        return;
      }
      setPendingDateKey(dateKey);
    },
    [canPressDate, lightCardCount],
  );

  const handleConfirm = useCallback(async () => {
    if (!pendingDateKey) {
      return;
    }
    const ok = await useForDate(pendingDateKey);
    if (ok) {
      setPendingDateKey(null);
    }
  }, [pendingDateKey, useForDate]);

  return (
    <View style={styles.container}>
      <View style={styles.divider} />

      <View style={styles.monthHeader}>
        <Pressable
          hitSlop={12}
          disabled={!canGoPrev}
          onPress={() => setVisibleMonth((prev) => shiftYearMonth(prev, -1))}
          style={styles.arrowButton}>
          <SymbolView
            name={{
              ios: 'chevron.left',
              android: 'arrow_back_ios',
              web: 'arrow_back_ios',
            }}
            size={16}
            tintColor={canGoPrev ? APP_TEXT_COLOR : DISABLED_ARROW}
          />
        </Pressable>
        <Text style={styles.monthLabel}>{formatYearMonthLabel(visibleMonth)}</Text>
        <Pressable
          hitSlop={12}
          disabled={!canGoNext}
          onPress={() => setVisibleMonth((prev) => shiftYearMonth(prev, 1))}
          style={styles.arrowButton}>
          <SymbolView
            name={{
              ios: 'chevron.right',
              android: 'arrow_forward_ios',
              web: 'arrow_forward_ios',
            }}
            size={16}
            tintColor={canGoNext ? APP_TEXT_COLOR : DISABLED_ARROW}
          />
        </Pressable>
      </View>

      <View style={styles.weekdayRow}>
        {WEEKDAY_LABELS.map((label) => (
          <Text key={label} style={styles.weekday}>
            {label}
          </Text>
        ))}
      </View>

      {rows.map((row, rowIndex) => {
        const runs = getConsecutiveRuns(row);
        return (
          <View
            key={`week-${rowIndex}`}
            style={styles.weekRow}
            onLayout={rowIndex === 0 ? handleRowLayout : undefined}>
            {cellWidth > 0
              ? runs.map((run) => {
                  const inset = (cellWidth - DAY_MARK_SIZE) / 2;
                  const left = run.startCol * cellWidth + inset;
                  const width =
                    (run.endCol - run.startCol) * cellWidth + DAY_MARK_SIZE;
                  return (
                    <View
                      key={`run-${run.startCol}-${run.endCol}`}
                      pointerEvents="none"
                      style={[styles.streakBar, { left, width }]}
                    />
                  );
                })
              : null}

            {row.map((cell, colIndex) => {
              const canPress =
                cell.dateKey !== null && canPressDate(cell.dateKey);

              return (
                <Pressable
                  key={`day-${rowIndex}-${colIndex}`}
                  style={styles.dayCell}
                  disabled={!canPress}
                  onPress={() => {
                    if (cell.dateKey) {
                      handlePressDay(cell.dateKey);
                    }
                  }}>
                  {cell.day !== null ? (
                    <View
                      style={[
                        styles.dayMark,
                        cell.isLightCard
                          ? styles.dayMarkLight
                          : cell.checkedIn
                            ? styles.dayMarkChecked
                            : undefined,
                      ]}>
                      <Text
                        style={[
                          styles.dayText,
                          cell.checkedIn || cell.isLightCard
                            ? styles.dayTextChecked
                            : undefined,
                          cell.isLightCard ? styles.dayTextLight : undefined,
                        ]}>
                        {cell.day}
                      </Text>
                    </View>
                  ) : null}
                </Pressable>
              );
            })}
          </View>
        );
      })}

      <UseLightCardConfirmModal
        visible={Boolean(pendingDateKey)}
        dateLabel={pendingDateKey ? formatDateLabel(pendingDateKey) : ''}
        remainingCount={lightCardCount}
        isSubmitting={isPending}
        onConfirm={() => {
          void handleConfirm();
        }}
        onCancel={() => setPendingDateKey(null)}
      />
      <SimpleTipModal
        visible={Boolean(tipMessage)}
        message={tipMessage ?? ''}
        onClose={() => setTipMessage(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    paddingBottom: 24,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: DIVIDER_COLOR,
    marginBottom: 20,
  },
  monthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  arrowButton: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: APP_TEXT_COLOR,
  },
  weekdayRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  weekday: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    color: '#94A3B8',
  },
  weekRow: {
    position: 'relative',
    flexDirection: 'row',
    height: CELL_HEIGHT,
    alignItems: 'center',
  },
  streakBar: {
    position: 'absolute',
    height: DAY_MARK_SIZE,
    borderRadius: DAY_MARK_SIZE / 2,
    backgroundColor: CHECKED_BG,
  },
  dayCell: {
    flex: 1,
    height: CELL_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayMark: {
    width: DAY_MARK_SIZE,
    height: DAY_MARK_SIZE,
    borderRadius: DAY_MARK_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayMarkChecked: {
    backgroundColor: CHECKED_BG,
  },
  dayMarkLight: {
    backgroundColor: LIGHT_CARD_BG,
  },
  dayText: {
    fontSize: 13,
    color: APP_TEXT_COLOR,
  },
  dayTextChecked: {
    fontWeight: '600',
  },
  dayTextLight: {
    color: '#FFFFFF',
  },
});
