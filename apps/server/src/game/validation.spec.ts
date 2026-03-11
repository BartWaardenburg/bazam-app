import {
  isValidAnswerIndex,
  validateQuestions,
  validateTitle,
  MAX_NICKNAME_LENGTH,
  MAX_QUESTION_TEXT_LENGTH,
  MAX_ANSWER_TEXT_LENGTH,
  MAX_QUESTIONS,
  MAX_TITLE_LENGTH,
} from './validation';

const validQuestion = (overrides: Record<string, unknown> = {}): Record<string, unknown> => ({
  text: 'What is 2 + 2?',
  answers: ['1', '2', '3', '4'],
  correctIndex: 3,
  timeLimitSeconds: 30,
  ...overrides,
});

describe('isValidAnswerIndex', () => {
  it.each([0, 1, 2, 3])('returns true for valid index %i', (index) => {
    expect(isValidAnswerIndex(index)).toBe(true);
  });

  it.each([-1, 4, 5, 99])('returns false for out-of-range index %i', (index) => {
    expect(isValidAnswerIndex(index)).toBe(false);
  });

  it('returns false for 0.5', () => {
    expect(isValidAnswerIndex(0.5)).toBe(false);
  });

  it('returns false for NaN', () => {
    expect(isValidAnswerIndex(NaN)).toBe(false);
  });

  it('returns false for Infinity', () => {
    expect(isValidAnswerIndex(Infinity)).toBe(false);
  });

  it('returns false for -Infinity', () => {
    expect(isValidAnswerIndex(-Infinity)).toBe(false);
  });
});

describe('validateQuestions', () => {
  describe('valid inputs', () => {
    it('accepts a single valid question', () => {
      expect(validateQuestions([validQuestion()])).toBe(true);
    });

    it('accepts multiple valid questions', () => {
      const questions = [
        validQuestion(),
        validQuestion({ text: 'What is 3 + 3?', correctIndex: 0 }),
      ];
      expect(validateQuestions(questions)).toBe(true);
    });

    it('accepts exactly 50 questions', () => {
      const questions = Array.from({ length: MAX_QUESTIONS }, () => validQuestion());
      expect(validateQuestions(questions)).toBe(true);
    });

    it('accepts timeLimitSeconds at boundary value 300', () => {
      expect(validateQuestions([validQuestion({ timeLimitSeconds: 300 })])).toBe(true);
    });

    it('accepts timeLimitSeconds of 1 (minimum positive)', () => {
      expect(validateQuestions([validQuestion({ timeLimitSeconds: 1 })])).toBe(true);
    });

    it('accepts question text at max length', () => {
      const text = 'a'.repeat(MAX_QUESTION_TEXT_LENGTH);
      expect(validateQuestions([validQuestion({ text })])).toBe(true);
    });

    it('accepts answer text at max length', () => {
      const answer = 'a'.repeat(MAX_ANSWER_TEXT_LENGTH);
      expect(validateQuestions([validQuestion({ answers: [answer, 'b', 'c', 'd'] })])).toBe(true);
    });
  });

  describe('invalid array-level inputs', () => {
    it('rejects an empty array', () => {
      expect(validateQuestions([])).toBe(false);
    });

    it('rejects a non-array value', () => {
      expect(validateQuestions('not an array')).toBe(false);
    });

    it('rejects null', () => {
      expect(validateQuestions(null)).toBe(false);
    });

    it('rejects undefined', () => {
      expect(validateQuestions(undefined)).toBe(false);
    });

    it('rejects a number', () => {
      expect(validateQuestions(42)).toBe(false);
    });

    it('rejects an object', () => {
      expect(validateQuestions({ length: 1 })).toBe(false);
    });

    it('rejects more than 50 questions', () => {
      const questions = Array.from({ length: MAX_QUESTIONS + 1 }, () => validQuestion());
      expect(validateQuestions(questions)).toBe(false);
    });
  });

  describe('invalid question text', () => {
    it('rejects question with empty text', () => {
      expect(validateQuestions([validQuestion({ text: '' })])).toBe(false);
    });

    it('rejects question with whitespace-only text', () => {
      expect(validateQuestions([validQuestion({ text: '   ' })])).toBe(false);
    });

    it('rejects question with text exceeding max length', () => {
      const text = 'a'.repeat(MAX_QUESTION_TEXT_LENGTH + 1);
      expect(validateQuestions([validQuestion({ text })])).toBe(false);
    });

    it('rejects question with non-string text', () => {
      expect(validateQuestions([validQuestion({ text: 123 })])).toBe(false);
    });

    it('rejects question with missing text', () => {
      const q = validQuestion();
      delete q.text;
      expect(validateQuestions([q])).toBe(false);
    });
  });

  describe('invalid answers', () => {
    it('rejects question with fewer than 4 answers', () => {
      expect(validateQuestions([validQuestion({ answers: ['a', 'b', 'c'] })])).toBe(false);
    });

    it('rejects question with more than 4 answers', () => {
      expect(validateQuestions([validQuestion({ answers: ['a', 'b', 'c', 'd', 'e'] })])).toBe(false);
    });

    it('rejects question with empty answer string', () => {
      expect(validateQuestions([validQuestion({ answers: ['a', '', 'c', 'd'] })])).toBe(false);
    });

    it('rejects question with whitespace-only answer', () => {
      expect(validateQuestions([validQuestion({ answers: ['a', '   ', 'c', 'd'] })])).toBe(false);
    });

    it('rejects question with answer exceeding max length', () => {
      const longAnswer = 'a'.repeat(MAX_ANSWER_TEXT_LENGTH + 1);
      expect(validateQuestions([validQuestion({ answers: [longAnswer, 'b', 'c', 'd'] })])).toBe(false);
    });

    it('rejects question with non-string answer', () => {
      expect(validateQuestions([validQuestion({ answers: [42, 'b', 'c', 'd'] })])).toBe(false);
    });

    it('rejects question with missing answers', () => {
      const q = validQuestion();
      delete q.answers;
      expect(validateQuestions([q])).toBe(false);
    });

    it('rejects question with null answers', () => {
      expect(validateQuestions([validQuestion({ answers: null })])).toBe(false);
    });
  });

  describe('invalid correctIndex', () => {
    it('rejects correctIndex of 4', () => {
      expect(validateQuestions([validQuestion({ correctIndex: 4 })])).toBe(false);
    });

    it('rejects correctIndex of -1', () => {
      expect(validateQuestions([validQuestion({ correctIndex: -1 })])).toBe(false);
    });

    it('rejects correctIndex of 0.5', () => {
      expect(validateQuestions([validQuestion({ correctIndex: 0.5 })])).toBe(false);
    });

    it('rejects non-number correctIndex', () => {
      expect(validateQuestions([validQuestion({ correctIndex: '0' })])).toBe(false);
    });

    it('rejects missing correctIndex', () => {
      const q = validQuestion();
      delete q.correctIndex;
      expect(validateQuestions([q])).toBe(false);
    });
  });

  describe('invalid timeLimitSeconds', () => {
    it('rejects timeLimitSeconds of 0', () => {
      expect(validateQuestions([validQuestion({ timeLimitSeconds: 0 })])).toBe(false);
    });

    it('rejects negative timeLimitSeconds', () => {
      expect(validateQuestions([validQuestion({ timeLimitSeconds: -10 })])).toBe(false);
    });

    it('rejects timeLimitSeconds exceeding 300', () => {
      expect(validateQuestions([validQuestion({ timeLimitSeconds: 301 })])).toBe(false);
    });

    it('rejects non-number timeLimitSeconds', () => {
      expect(validateQuestions([validQuestion({ timeLimitSeconds: '30' })])).toBe(false);
    });

    it('rejects missing timeLimitSeconds', () => {
      const q = validQuestion();
      delete q.timeLimitSeconds;
      expect(validateQuestions([q])).toBe(false);
    });
  });

  describe('invalid question object', () => {
    it('rejects null as a question item', () => {
      expect(validateQuestions([null])).toBe(false);
    });

    it('rejects a non-object question item', () => {
      expect(validateQuestions(['not a question'])).toBe(false);
    });

    it('rejects a number as a question item', () => {
      expect(validateQuestions([42])).toBe(false);
    });

    it('rejects an array mixed with valid and invalid questions', () => {
      expect(validateQuestions([validQuestion(), null])).toBe(false);
    });
  });
});

describe('validateTitle', () => {
  describe('valid titles', () => {
    it('accepts a normal title', () => {
      expect(validateTitle('My Quiz')).toBe(true);
    });

    it('accepts a single-character title', () => {
      expect(validateTitle('A')).toBe(true);
    });

    it('accepts a title of exactly 200 characters', () => {
      const title = 'a'.repeat(MAX_TITLE_LENGTH);
      expect(validateTitle(title)).toBe(true);
    });

    it('accepts a title with leading/trailing spaces if it has non-space content', () => {
      expect(validateTitle('  Quiz  ')).toBe(true);
    });
  });

  describe('invalid titles', () => {
    it('rejects an empty string', () => {
      expect(validateTitle('')).toBe(false);
    });

    it('rejects a whitespace-only string', () => {
      expect(validateTitle('   ')).toBe(false);
    });

    it('rejects a tab-only string', () => {
      expect(validateTitle('\t\t')).toBe(false);
    });

    it('rejects a title exceeding 200 characters', () => {
      const title = 'a'.repeat(MAX_TITLE_LENGTH + 1);
      expect(validateTitle(title)).toBe(false);
    });

    it('rejects null', () => {
      expect(validateTitle(null)).toBe(false);
    });

    it('rejects undefined', () => {
      expect(validateTitle(undefined)).toBe(false);
    });

    it('rejects a number', () => {
      expect(validateTitle(42)).toBe(false);
    });

    it('rejects a boolean', () => {
      expect(validateTitle(true)).toBe(false);
    });

    it('rejects an object', () => {
      expect(validateTitle({ toString: () => 'Quiz' })).toBe(false);
    });

    it('rejects an array', () => {
      expect(validateTitle(['Quiz'])).toBe(false);
    });
  });

  describe('exported constants', () => {
    it('exports MAX_NICKNAME_LENGTH as 32', () => {
      expect(MAX_NICKNAME_LENGTH).toBe(32);
    });

    it('exports MAX_QUESTION_TEXT_LENGTH as 500', () => {
      expect(MAX_QUESTION_TEXT_LENGTH).toBe(500);
    });

    it('exports MAX_ANSWER_TEXT_LENGTH as 200', () => {
      expect(MAX_ANSWER_TEXT_LENGTH).toBe(200);
    });

    it('exports MAX_QUESTIONS as 50', () => {
      expect(MAX_QUESTIONS).toBe(50);
    });

    it('exports MAX_TITLE_LENGTH as 200', () => {
      expect(MAX_TITLE_LENGTH).toBe(200);
    });
  });
});
