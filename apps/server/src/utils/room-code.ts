const DIGITS = '0123456789';
const CODE_LENGTH = 6;
const MAX_ATTEMPTS = 10_000;
/** Largest multiple of DIGITS.length (10) that fits in a byte. Values >= this are rejected. */
const MAX_FAIR_VALUE = 250;

/**
 * Generates a unique numeric room code that does not collide with existing codes.
 * Uses cryptographically secure random values with rejection sampling to avoid modulo bias.
 *
 * @param existingCodes - Set of room codes currently in use.
 * @returns A unique 6-digit room code string, or null if code space is exhausted.
 */
export const generateRoomCode = (existingCodes: Set<string>): string | null => {
  let attempts = 0;
  for (;;) {
    if (++attempts > MAX_ATTEMPTS) return null;
    // Request extra bytes to account for rejection sampling
    const bytes = new Uint8Array(CODE_LENGTH * 2);
    crypto.getRandomValues(bytes);
    const digits: string[] = [];
    for (const b of bytes) {
      if (b >= MAX_FAIR_VALUE) continue;
      digits.push(DIGITS[b % DIGITS.length]);
      if (digits.length === CODE_LENGTH) break;
    }
    if (digits.length < CODE_LENGTH) continue;
    const code = digits.join('');
    if (!existingCodes.has(code)) return code;
  }
};
