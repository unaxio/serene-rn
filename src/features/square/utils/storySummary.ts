import { STORY_SUMMARY_MAX_LENGTH } from '@/src/features/square/constants';

export function resolveStorySummary(summary: string | undefined, content: string): string {
  const fromBackend = summary?.trim();
  if (fromBackend) {
    return fromBackend;
  }

  const text = content.trim().replace(/\s+/g, ' ');
  if (text.length <= STORY_SUMMARY_MAX_LENGTH) {
    return text;
  }
  return `${text.slice(0, STORY_SUMMARY_MAX_LENGTH)}…`;
}
