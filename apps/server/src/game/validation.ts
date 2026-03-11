import type { AnswerIndex, QuestionInput } from '@bazam/shared-types';

/** Maximum allowed length for a player nickname. */
export const MAX_NICKNAME_LENGTH = 32;

/** Maximum allowed length for a question's text body. */
export const MAX_QUESTION_TEXT_LENGTH = 500;

/** Maximum allowed length for a single answer option's text. */
export const MAX_ANSWER_TEXT_LENGTH = 200;

/** Maximum number of questions allowed in a single quiz. */
export const MAX_QUESTIONS = 50;

/** Maximum allowed length for a quiz title. */
export const MAX_TITLE_LENGTH = 200;

/** Set of valid answer indices (0 through 3) for constant-time lookups. */
const VALID_ANSWER_INDICES: ReadonlySet<number> = new Set([0, 1, 2, 3]);

/**
 * Type guard that checks whether a numeric value is a valid {@link AnswerIndex}.
 *
 * @param value - The numeric value to validate.
 * @returns True if the value is 0, 1, 2, or 3.
 */
export const isValidAnswerIndex = (value: number): value is AnswerIndex =>
  VALID_ANSWER_INDICES.has(value);

/**
 * Validates that the given value is a well-formed array of {@link QuestionInput} objects.
 * Performs comprehensive checks on the structure, including:
 * - Array must be non-empty and contain at most {@link MAX_QUESTIONS} items.
 * - Each question must have non-empty text within {@link MAX_QUESTION_TEXT_LENGTH}.
 * - Each question must have exactly 4 non-empty answer strings within {@link MAX_ANSWER_TEXT_LENGTH}.
 * - The correctIndex must be a valid {@link AnswerIndex} (0-3).
 * - The timeLimitSeconds must be a positive number up to 300.
 *
 * @param questions - The unknown value to validate.
 * @returns True if the value is a valid QuestionInput array.
 */
export const validateQuestions = (questions: unknown): questions is QuestionInput[] => {
  if (!Array.isArray(questions) || questions.length === 0 || questions.length > MAX_QUESTIONS) {
    return false;
  }
  return questions.every(
    (q: unknown) =>
      typeof q === 'object' &&
      q !== null &&
      typeof (q as QuestionInput).text === 'string' &&
      (q as QuestionInput).text.trim().length > 0 &&
      (q as QuestionInput).text.length <= MAX_QUESTION_TEXT_LENGTH &&
      Array.isArray((q as QuestionInput).answers) &&
      (q as QuestionInput).answers.length === 4 &&
      (q as QuestionInput).answers.every(
        (a: unknown) => typeof a === 'string' && (a as string).trim().length > 0 && (a as string).length <= MAX_ANSWER_TEXT_LENGTH
      ) &&
      isValidAnswerIndex((q as QuestionInput).correctIndex) &&
      typeof (q as QuestionInput).timeLimitSeconds === 'number' &&
      (q as QuestionInput).timeLimitSeconds > 0 &&
      (q as QuestionInput).timeLimitSeconds <= 300
  );
};

/**
 * Validates that the given value is a non-empty quiz title within the length limit.
 *
 * @param title - The unknown value to validate.
 * @returns True if the value is a non-empty string of at most {@link MAX_TITLE_LENGTH} characters.
 */
export const validateTitle = (title: unknown): title is string =>
  typeof title === 'string' && title.trim().length > 0 && title.length <= MAX_TITLE_LENGTH;
