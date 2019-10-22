import pino, { Logger as PinoLogger, Level } from 'pino';
import { chindingsSym } from 'pino/lib/symbols';

export type Logger = {
  setLogLevel: (level: Level) => void;
  setApp: (name: string) => void;
  getFor: (moduleName: string) => Logger;
  traceTime: (label: string, fn: () => Promise<any>) => Promise<any>;
} & PinoLogger;

let isAppSet: boolean = false;
const logger: Logger = pino() as Logger;

/**
 * Sets the log level for the logger instance
 * @param level Required log level
 * @returns {void}
 */
logger.setLogLevel = (level: Level): void => {
  logger.level = level;
};

/**
 * Sets the "app" key to every log message via the root logger instance.
 * It can be called only once, preferably at the very beginning of your application.
 * @param name Application name
 * @returns {void}
 */
logger.setApp = (name: string): void => {
  if (isAppSet) {
    logger.warn('logger.setApp() can be called only once.');
    return;
  }
  // @ts-ignore: Tweaking internal Pino settings
  logger[chindingsSym] += `,"app":"${name}"`;
  isAppSet = true;
};

/**
 * Initializes an extra sub-logger instance for the provided module name
 * and adds "module" key to every log message automatically.
 * Handy for defining sub-loggers for your nested modules.
 * In conjunction with `falcon-pretty` formatter - it will render an additional "[my-module]" section in the log message output.
 * @example
 * logger.getFor("my-module").info("Calling my-module...");
 * @param moduleName Module name
 * @returns Module-specific Logger instance
 */
logger.getFor = (moduleName: string): Logger => logger.child({ module: moduleName }) as Logger;

/**
 * Measures the timing for the provided callback.
 * If your log level is set to trace - Logger will produce the following log message:
 * "TRACE: My time (XX ms)"
 * @param label Log label
 * @param fn Function to trace the execution time of
 * @returns `fn` result
 */
logger.traceTime = function<T = any>(label: string, fn: () => Promise<T>): Promise<T> {
  // using `function()` statement to preserve the context in case of "getFor" call
  if (!this.isLevelEnabled('trace')) {
    return fn();
  }

  const startTime = Date.now();
  return fn().finally(() => {
    const duration = Date.now() - startTime;
    this.trace(`${label} (${duration}ms)`);
  });
};

export default logger;
