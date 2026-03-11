import { generateRoomCode } from './room-code';

describe('generateRoomCode', () => {
  it('returns a 6-character string', () => {
    const code = generateRoomCode(new Set());
    expect(code).toHaveLength(6);
  });

  it('returns only numeric characters', () => {
    const code = generateRoomCode(new Set());
    expect(code).toMatch(/^\d{6}$/);
  });

  it('works with an empty set', () => {
    const code = generateRoomCode(new Set());
    expect(typeof code).toBe('string');
    expect(code).toHaveLength(6);
  });

  it('does not collide with existing codes', () => {
    const existing = new Set(['123456', '654321', '000000']);
    const code = generateRoomCode(existing);
    expect(existing.has(code)).toBe(false);
  });

  it('returns different codes on successive calls (probabilistic)', () => {
    const codes = new Set<string>();
    for (let i = 0; i < 100; i++) {
      codes.add(generateRoomCode(new Set()));
    }
    // With 6-digit numeric codes (1M possibilities), 100 calls should produce at least 2 unique codes
    expect(codes.size).toBeGreaterThan(1);
  });

  it('avoids all existing codes', () => {
    const existing = new Set<string>();
    // Generate 50 codes, each time adding the previous to the existing set
    for (let i = 0; i < 50; i++) {
      const code = generateRoomCode(existing);
      expect(existing.has(code)).toBe(false);
      existing.add(code);
    }
    expect(existing.size).toBe(50);
  });

  it('throws when code space is exhausted', () => {
    // Mock Math.random to always return 0, generating "000000" every time
    const originalRandom = Math.random;
    Math.random = () => 0;
    try {
      const existing = new Set(['000000']);
      expect(() => generateRoomCode(existing)).toThrow('Room code space exhausted');
    } finally {
      Math.random = originalRandom;
    }
  });

  it('succeeds if a non-colliding code is found within attempts', () => {
    // Mock Math.random to return 0 most of the time, then a different value
    const originalRandom = Math.random;
    let callCount = 0;
    Math.random = () => {
      callCount++;
      // Return 0 for the first 36 calls (6 chars per code * 6 attempts = all produce "000000")
      // Then return 0.5 to produce a different code
      return callCount <= 36 ? 0 : 0.5;
    };
    try {
      const existing = new Set(['000000']);
      const code = generateRoomCode(existing);
      expect(code).not.toBe('000000');
      expect(code).toHaveLength(6);
      expect(code).toMatch(/^\d{6}$/);
    } finally {
      Math.random = originalRandom;
    }
  });
});
