const CHARSET = '0123456789';
const CODE_LENGTH = 6;

export const generateRoomCode = (existingCodes: Set<string>): string => {
  let code: string;
  do {
    code = Array.from(
      { length: CODE_LENGTH },
      () => CHARSET[Math.floor(Math.random() * CHARSET.length)]
    ).join('');
  } while (existingCodes.has(code));
  return code;
};
