import { StyleSheet, Text, TextInput, View } from 'react-native';

import { APP_TEXT_COLOR } from '@/constants/Colors';
import { PLACEHOLDER_TEXT_COLOR, SEARCH_BAR_BG } from '@/src/features/square/constants';

interface CountedTextInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  maxLength: number;
  multiline?: boolean;
  minHeight?: number;
}

export function CountedTextInput({
  value,
  onChangeText,
  placeholder,
  maxLength,
  multiline = false,
  minHeight,
}: CountedTextInputProps) {
  return (
    <View style={styles.wrap}>
      <TextInput
        style={[styles.input, multiline && styles.multiline, minHeight ? { minHeight } : null]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
        maxLength={maxLength}
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'center'}
      />
      <Text style={styles.counter}>
        {value.length}/{maxLength}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: SEARCH_BAR_BG,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 8,
  },
  input: {
    fontSize: 15,
    color: APP_TEXT_COLOR,
    padding: 0,
    minHeight: 24,
  },
  multiline: {
    minHeight: 140,
  },
  counter: {
    marginTop: 8,
    alignSelf: 'flex-end',
    fontSize: 11,
    color: PLACEHOLDER_TEXT_COLOR,
  },
});
