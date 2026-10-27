import type { SearchTextPart } from '@/src/features/square/types';

const HIGHLIGHT_OPEN = '<em>';
const HIGHLIGHT_CLOSE = '</em>';

export function plainSearchText(value: string): SearchTextPart[] {
  if (value.length === 0) {
    return [];
  }
  return [{ text: value, highlighted: false }];
}

/** `<em>` 只表示高亮，其余字符保持纯文本。 */
export function splitSearchHighlight(source: string): SearchTextPart[] {
  const parts: SearchTextPart[] = [];
  let index = 0;
  let highlighted = false;
  while (index < source.length) {
    const token = highlighted ? HIGHLIGHT_CLOSE : HIGHLIGHT_OPEN;
    const found = source.indexOf(token, index);
    if (found < 0) {
      pushPart(parts, source.slice(index), highlighted);
      break;
    }
    pushPart(parts, source.slice(index, found), highlighted);
    highlighted = !highlighted;
    index = found + token.length;
  }
  return parts;
}

export function searchDisplayParts(summary: string | undefined, original: string, useSummary: boolean): SearchTextPart[] {
  if (useSummary && typeof summary === 'string' && summary.length > 0) {
    return splitSearchHighlight(summary);
  }
  return plainSearchText(original);
}

function pushPart(parts: SearchTextPart[], text: string, highlighted: boolean): void {
  if (text.length === 0) {
    return;
  }
  parts.push({ text, highlighted });
}
