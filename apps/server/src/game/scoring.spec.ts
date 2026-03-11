import { calculateScore } from './scoring';

describe('calculateScore', () => {
  const TIME_LIMIT = 10_000; // 10 seconds

  describe('incorrect answers', () => {
    it('returns 0 for a wrong answer', () => {
      expect(calculateScore(false, 0, TIME_LIMIT)).toBe(0);
    });

    it('returns 0 for a wrong answer regardless of response time', () => {
      expect(calculateScore(false, 5_000, TIME_LIMIT)).toBe(0);
    });

    it('returns 0 for a wrong answer with a streak', () => {
      expect(calculateScore(false, 0, TIME_LIMIT, 5)).toBe(0);
    });
  });

  describe('correct answers without streak', () => {
    it('awards 1000 points for an instant correct answer', () => {
      expect(calculateScore(true, 0, TIME_LIMIT)).toBe(1000);
    });

    it('awards 100 points for a correct answer at the time limit', () => {
      expect(calculateScore(true, TIME_LIMIT, TIME_LIMIT)).toBe(100);
    });

    it('awards ~550 points for an answer at halfway', () => {
      const score = calculateScore(true, 5_000, TIME_LIMIT);
      expect(score).toBe(550);
    });

    it('allows score above MAX_SCORE for negative response time (no upper clamp)', () => {
      // timeFraction = max(0, 1 - (-1000/10000)) = max(0, 1.1) = 1.1
      // baseScore = 100 + 900 * 1.1 = 1090
      const score = calculateScore(true, -1_000, TIME_LIMIT);
      expect(score).toBe(1090);
    });

    it('awards MIN_SCORE when response time exceeds the time limit', () => {
      const score = calculateScore(true, 15_000, TIME_LIMIT);
      expect(score).toBe(100);
    });
  });

  describe('streak bonuses', () => {
    it('applies no bonus for streak 0', () => {
      expect(calculateScore(true, 0, TIME_LIMIT, 0)).toBe(1000);
    });

    it('applies no bonus for streak 1', () => {
      expect(calculateScore(true, 0, TIME_LIMIT, 1)).toBe(1000);
    });

    it('applies 5% bonus for streak 2', () => {
      // 1000 * 1.05 = 1050
      expect(calculateScore(true, 0, TIME_LIMIT, 2)).toBe(1050);
    });

    it('applies 10% bonus for streak 3', () => {
      // 1000 * 1.10 = 1100
      expect(calculateScore(true, 0, TIME_LIMIT, 3)).toBe(1100);
    });

    it('applies 10% bonus for streak 4', () => {
      // streak 4 >= 3 but < 5, so 10% bonus
      expect(calculateScore(true, 0, TIME_LIMIT, 4)).toBe(1100);
    });

    it('applies 15% bonus for streak 5', () => {
      // 1000 * 1.15 = 1150
      expect(calculateScore(true, 0, TIME_LIMIT, 5)).toBe(1150);
    });

    it('caps at 15% bonus for streak 10', () => {
      // streak 10 still gets 15% (highest tier)
      expect(calculateScore(true, 0, TIME_LIMIT, 10)).toBe(1150);
    });

    it('applies streak bonus to MIN_SCORE correctly', () => {
      // 100 * 1.15 = 115
      expect(calculateScore(true, TIME_LIMIT, TIME_LIMIT, 5)).toBe(115);
    });

    it('applies streak bonus to mid-range score correctly', () => {
      // baseScore at halfway = 550, with streak 3: 550 * 1.10 = 605
      expect(calculateScore(true, 5_000, TIME_LIMIT, 3)).toBe(605);
    });
  });

  describe('default streak parameter', () => {
    it('defaults streak to 0 when omitted', () => {
      const withExplicitZero = calculateScore(true, 2_000, TIME_LIMIT, 0);
      const withDefault = calculateScore(true, 2_000, TIME_LIMIT);
      expect(withDefault).toBe(withExplicitZero);
    });
  });

  describe('rounding', () => {
    it('returns a rounded integer', () => {
      // Any combination should produce an integer
      const score = calculateScore(true, 3_333, TIME_LIMIT, 2);
      expect(Number.isInteger(score)).toBe(true);
    });
  });
});
