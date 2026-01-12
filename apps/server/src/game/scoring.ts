const MAX_SCORE = 1000;
const MIN_SCORE = 100;

export const calculateScore = (isCorrect: boolean, responseTimeMs: number, timeLimitMs: number): number => {
  if (!isCorrect) return 0;
  const timeFraction = Math.max(0, 1 - responseTimeMs / timeLimitMs);
  return Math.round(MIN_SCORE + (MAX_SCORE - MIN_SCORE) * timeFraction);
};
