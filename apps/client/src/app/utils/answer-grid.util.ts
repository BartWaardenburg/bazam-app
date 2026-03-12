import type { AnswerGridItem } from '@bazam/ui';

/** Maps raw answer strings to `AnswerGridItem` objects for the answer grid component. */
export const toAnswerGridItems = (answers: string[], selectedIndex?: number | null): AnswerGridItem[] =>
  answers.map((text, index) => ({
    text,
    ...(selectedIndex != null ? { selected: selectedIndex === index } : {}),
  }));
