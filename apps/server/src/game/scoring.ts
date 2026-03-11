/** Maximum points awarded for an instant correct answer. */
const MAX_SCORE = 1000;
/** Minimum points awarded for a correct answer at the time limit. */
const MIN_SCORE = 100;

/** Streak bonus tiers — checked in descending order, first match wins. */
const STREAK_BONUSES: ReadonlyArray<{ readonly minStreak: number; readonly bonus: number }> = [
  { minStreak: 5, bonus: 0.15 },
  { minStreak: 3, bonus: 0.10 },
  { minStreak: 2, bonus: 0.05 },
];

/**
 * Calculates the score for a single answer.
 * Correct answers earn between {@link MIN_SCORE} and {@link MAX_SCORE} points
 * based on response speed, with a bonus multiplier for answer streaks.
 * Incorrect answers earn 0.
 *
 * @param isCorrect - Whether the player answered correctly.
 * @param responseTimeMs - Time taken to answer in milliseconds.
 * @param timeLimitMs - Total time allowed for the question in milliseconds.
 * @param streak - Number of consecutive correct answers before this one.
 * @returns Points earned for this answer.
 */
export const calculateScore = (isCorrect: boolean, responseTimeMs: number, timeLimitMs: number, streak = 0): number => {
  if (!isCorrect) return 0;
  const timeFraction = Math.max(0, 1 - responseTimeMs / timeLimitMs);
  const baseScore = MIN_SCORE + (MAX_SCORE - MIN_SCORE) * timeFraction;
  const streakBonus = STREAK_BONUSES.find((b) => streak >= b.minStreak)?.bonus ?? 0;
  return Math.round(baseScore * (1 + streakBonus));
};
