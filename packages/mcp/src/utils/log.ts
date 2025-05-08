/**
 * Custom logger that writes to stderr only.
 */
export const log = {
  info: (...args: unknown[]) => console.error('[INFO]', ...args),
  error: (...args: unknown[]) => console.error('[ERROR]', ...args),
  debug: (...args: unknown[]) => console.error('[DEBUG]', ...args),
  warn: (...args: unknown[]) => console.error('[WARN]', ...args),
}
