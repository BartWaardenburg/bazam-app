import { generateRoomCode } from './room-code';

describe('generateRoomCode', () => {
  it('returns a 6-character string', () => {
    const code = generateRoomCode(new Set());
    expect(code).not.toBeNull();
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
    expect(code).not.toBeNull();
    expect(existing.has(code!)).toBe(false);
  });

  it('returns different codes on successive calls (probabilistic)', () => {
    const codes = new Set<string | null>();
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
      expect(code).not.toBeNull();
      expect(existing.has(code!)).toBe(false);
      existing.add(code!);
    }
    expect(existing.size).toBe(50);
  });

  it('returns null when code space is exhausted', () => {
    // Mock crypto.getRandomValues to always return zeros, generating "000000" every time
    const original = crypto.getRandomValues.bind(crypto);
    crypto.getRandomValues = (<T extends ArrayBufferView>(array: T): T => {
      if (array instanceof Uint8Array) {
        array.fill(0);
      }
      return array;
    }) as typeof crypto.getRandomValues;
    try {
      const existing = new Set(['000000']);
      const result = generateRoomCode(existing);
      expect(result).toBeNull();
    } finally {
      crypto.getRandomValues = original;
    }
  });

  it('succeeds if a non-colliding code is found within attempts', () => {
    // Mock crypto.getRandomValues to return zeros first, then different values
    const original = crypto.getRandomValues.bind(crypto);
    let callCount = 0;
    crypto.getRandomValues = (<T extends ArrayBufferView>(array: T): T => {
      callCount++;
      if (array instanceof Uint8Array) {
        // First 6 calls produce "000000", then produce different values
        if (callCount <= 6) {
          array.fill(0);
        } else {
          array.fill(5);
        }
      }
      return array;
    }) as typeof crypto.getRandomValues;
    try {
      const existing = new Set(['000000']);
      const code = generateRoomCode(existing);
      expect(code).not.toBeNull();
      expect(code).not.toBe('000000');
      expect(code).toHaveLength(6);
      expect(code).toMatch(/^\d{6}$/);
    } finally {
      crypto.getRandomValues = original;
    }
  });
});
