import { describe, it, expect } from 'vitest';
import { toAnswerGridItems } from './answer-grid.util';

describe('toAnswerGridItems', () => {
  const answers = ['A', 'B', 'C', 'D'];

  it('should map answers to objects with text only when no selectedIndex is provided', () => {
    const result = toAnswerGridItems(answers);

    expect(result).toEqual([
      { text: 'A' },
      { text: 'B' },
      { text: 'C' },
      { text: 'D' },
    ]);
  });

  it('should include selected: false for all items when selectedIndex is null', () => {
    const result = toAnswerGridItems(answers, null);

    expect(result).toEqual([
      { text: 'A' },
      { text: 'B' },
      { text: 'C' },
      { text: 'D' },
    ]);
  });

  it('should mark the correct answer as selected when selectedIndex matches', () => {
    const result = toAnswerGridItems(answers, 2);

    expect(result).toEqual([
      { text: 'A', selected: false },
      { text: 'B', selected: false },
      { text: 'C', selected: true },
      { text: 'D', selected: false },
    ]);
  });

  it('should mark index 0 as selected', () => {
    const result = toAnswerGridItems(answers, 0);

    expect(result[0]).toEqual({ text: 'A', selected: true });
    expect(result[1]).toEqual({ text: 'B', selected: false });
  });

  it('should handle empty answers array', () => {
    expect(toAnswerGridItems([])).toEqual([]);
  });

  it('should treat undefined selectedIndex the same as not provided', () => {
    const result = toAnswerGridItems(answers, undefined);

    expect(result).toEqual([
      { text: 'A' },
      { text: 'B' },
      { text: 'C' },
      { text: 'D' },
    ]);
  });
});
