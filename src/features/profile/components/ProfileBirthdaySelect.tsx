import { useMemo } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';

import { APP_TEXT_COLOR } from '@/constants/Colors';
import { PROFILE_MUTED } from '@/src/features/profile/constants';
import {
  daysInMonth,
  formatBirthdayParts,
  parseBirthdayParts,
  type BirthdayParts,
} from '@/src/features/profile/utils/birthdayParts';

interface ProfileBirthdaySelectProps {
  value: string;
  onChange: (birthday: string) => void;
}

const YEAR_SPAN = 100;
const DEFAULT_YEAR = 2000;
const DEFAULT_MONTH = 1;
const DEFAULT_DAY = 1;

function buildYearOptions(maxYear: number): number[] {
  const years: number[] = [];
  for (let year = maxYear; year >= maxYear - YEAR_SPAN; year -= 1) {
    years.push(year);
  }
  return years;
}

const MONTH_OPTIONS = Array.from({ length: 12 }, (_, index) => index + 1);

export function ProfileBirthdaySelect({ value, onChange }: ProfileBirthdaySelectProps) {
  const maxYear = new Date().getFullYear();
  const yearOptions = useMemo(() => buildYearOptions(maxYear), [maxYear]);

  const parts = useMemo((): BirthdayParts => {
    const parsed = parseBirthdayParts(value);
    return {
      year: parsed?.year ?? DEFAULT_YEAR,
      month: parsed?.month ?? DEFAULT_MONTH,
      day: parsed?.day ?? DEFAULT_DAY,
    };
  }, [value]);

  const dayCount = daysInMonth(parts.year, parts.month);
  const dayOptions = useMemo(
    () => Array.from({ length: dayCount }, (_, index) => index + 1),
    [dayCount],
  );

  const safeDay = Math.min(parts.day, dayCount);

  const emit = (next: BirthdayParts) => {
    const cappedDay = Math.min(next.day, daysInMonth(next.year, next.month));
    onChange(formatBirthdayParts({ ...next, day: cappedDay }));
  };

  return (
    <View style={styles.row}>
      <View style={[styles.field, styles.year]}>
        <Picker
          selectedValue={parts.year}
          onValueChange={(year) => emit({ ...parts, year: Number(year) })}
          style={styles.picker}
          mode={Platform.OS === 'android' ? 'dropdown' : undefined}
          dropdownIconColor={PROFILE_MUTED}>
          {yearOptions.map((year) => (
            <Picker.Item key={year} label={`${year}年`} value={year} color={APP_TEXT_COLOR} />
          ))}
        </Picker>
      </View>
      <View style={[styles.field, styles.month]}>
        <Picker
          selectedValue={parts.month}
          onValueChange={(month) => emit({ ...parts, month: Number(month) })}
          style={styles.picker}
          mode={Platform.OS === 'android' ? 'dropdown' : undefined}
          dropdownIconColor={PROFILE_MUTED}>
          {MONTH_OPTIONS.map((month) => (
            <Picker.Item key={month} label={`${month}月`} value={month} color={APP_TEXT_COLOR} />
          ))}
        </Picker>
      </View>
      <View style={[styles.field, styles.day]}>
        <Picker
          selectedValue={safeDay}
          onValueChange={(day) => emit({ ...parts, day: Number(day) })}
          style={styles.picker}
          mode={Platform.OS === 'android' ? 'dropdown' : undefined}
          dropdownIconColor={PROFILE_MUTED}>
          {dayOptions.map((day) => (
            <Picker.Item key={day} label={`${day}日`} value={day} color={APP_TEXT_COLOR} />
          ))}
        </Picker>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  field: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    overflow: 'hidden',
    justifyContent: 'center',
    minHeight: 44,
  },
  year: { flex: 1.2 },
  month: { flex: 1 },
  day: { flex: 1 },
  picker: {
    width: '100%',
    color: APP_TEXT_COLOR,
    ...Platform.select({
      web: {
        height: 44,
        borderWidth: 0,
        backgroundColor: 'transparent',
        paddingHorizontal: 8,
        fontSize: 15,
      },
      ios: {
        height: 120,
      },
      android: {
        height: 44,
      },
      default: {
        height: 44,
      },
    }),
  },
});
