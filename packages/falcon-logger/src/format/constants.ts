import { LOGGER_KEYS as loggerKeys } from 'pino-pretty/lib/constants';

export { ERROR_LIKE_KEYS, MESSAGE_KEY, TIMESTAMP_KEY, LEVELS, LEVEL_NAMES } from 'pino-pretty/lib/constants';

export const LOGGER_KEYS: string[] = [...loggerKeys, 'module', 'app'];
