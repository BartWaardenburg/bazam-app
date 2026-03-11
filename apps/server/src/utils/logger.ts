/** Supported log severity levels. */
type LogLevel = 'info' | 'warn' | 'error' | 'debug';

/**
 * Writes a structured JSON log entry to the console.
 *
 * @param level - Severity level.
 * @param message - Human-readable log message.
 * @param data - Optional key-value metadata to include in the log entry.
 */
const log = (level: LogLevel, message: string, data?: Record<string, unknown>): void => {
  const timestamp = new Date().toISOString();
  const entry = { timestamp, level, message, ...data };
  console[level === 'debug' ? 'log' : level](JSON.stringify(entry));
};

/** Structured logger that outputs JSON to the console. */
export const logger = {
  /** Logs an informational message. */
  info: (msg: string, data?: Record<string, unknown>) => log('info', msg, data),
  /** Logs a warning message. */
  warn: (msg: string, data?: Record<string, unknown>) => log('warn', msg, data),
  /** Logs an error message. */
  error: (msg: string, data?: Record<string, unknown>) => log('error', msg, data),
  /** Logs a debug message. */
  debug: (msg: string, data?: Record<string, unknown>) => log('debug', msg, data),
};
