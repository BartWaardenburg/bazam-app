const CHARSET = '0123456789';
const CODE_LENGTH = 6;
const MAX_ATTEMPTS = 10_000;

export const generateRoomCode = (existingCodes: Set<string>): string => {
  let code: string;
  let attempts = 0;
  do {
    if (++attempts > MAX_ATTEMPTS) throw new Error('Room code space exhausted');
    code = Array.from(
      { length: CODE_LENGTH },
      () => CHARSET[Math.floor(Math.random() * CHARSET.length)]
    ).join('');
  } while (existingCodes.has(code));
  return code;
};
