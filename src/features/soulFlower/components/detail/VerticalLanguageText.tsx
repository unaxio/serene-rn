import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { ChineseOpeningQuote } from '@/src/features/soulFlower/components/detail/ChineseOpeningQuote';
import { APP_TEXT_COLOR } from '@/src/features/soulFlower/constants';

interface VerticalLanguageTextProps {
  text: string;
  quoteColor: string;
  maxHeight: number;
  scale: number;
}

const BASE_CHAR_SIZE = 16;
const BASE_QUOTE_SIZE = 30;

export function VerticalLanguageText({
  text,
  quoteColor,
  maxHeight,
  scale,
}: VerticalLanguageTextProps) {
  const charSize = BASE_CHAR_SIZE * scale;
  const charLineHeight = charSize + 4;
  const quoteSize = BASE_QUOTE_SIZE * scale;
  const quoteBlockHeight = quoteSize + 6;

  const columns = useMemo(() => {
    const chars = Array.from(text.trim());
    const columnHeight = Math.max(charLineHeight, maxHeight - quoteBlockHeight);
    const charsPerColumn = Math.max(1, Math.floor(columnHeight / charLineHeight));
    const result: string[][] = [];
    for (let index = 0; index < chars.length; index += charsPerColumn) {
      result.push(chars.slice(index, index + charsPerColumn));
    }
    return result;
  }, [text, maxHeight, charLineHeight, quoteBlockHeight]);

  if (!text.trim()) {
    return null;
  }

  return (
    <View style={styles.wrap}>
      <ChineseOpeningQuote color={quoteColor} size={quoteSize} />
      <View style={[styles.columns, { maxHeight: Math.max(0, maxHeight - quoteBlockHeight) }]}>
        {columns.map((column, columnIndex) => (
          <View
            key={`col-${columnIndex}`}
            style={[styles.column, { width: charSize + 4 }]}>
            {column.map((char, charIndex) => (
              <Text
                key={`ch-${columnIndex}-${charIndex}`}
                style={[
                  styles.char,
                  { fontSize: charSize, lineHeight: charLineHeight },
                ]}>
                {char}
              </Text>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'flex-end',
    paddingTop: 8,
  },
  columns: {
    flexDirection: 'row-reverse',
    alignItems: 'flex-start',
    overflow: 'hidden',
  },
  column: {
    alignItems: 'center',
  },
  char: {
    color: APP_TEXT_COLOR,
  },
});
