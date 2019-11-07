import chalk from 'chalk';
import jmespath from 'jmespath';
import * as CONSTANTS from './constants';
import colors from './colors';
import minimal from './minimal';
import {
  isObject,
  jsonParser,
  prettifyErrorLog,
  prettifyGraphQLErrorLog,
  prettifyLevel,
  prettifyMessage,
  prettifyMetadata,
  prettifyObject,
  prettifyModule,
  prettifyTime
} from './utils';

const defaultOptions: { [key: string]: any } = {
  colorize: chalk.supportsColor,
  crlf: false,
  errorLikeObjectKeys: CONSTANTS.ERROR_LIKE_KEYS,
  errorProps: '',
  levelFirst: false,
  messageKey: CONSTANTS.MESSAGE_KEY,
  timestampKey: CONSTANTS.TIMESTAMP_KEY,
  translateTime: 'SYS:yyyy-mm-dd HH:MM:ss.l',
  useMetadata: false,
  outputStream: process.stdout
};

export {
  CONSTANTS,
  colors,
  isObject,
  jsonParser,
  prettifyErrorLog,
  prettifyGraphQLErrorLog,
  prettifyLevel,
  prettifyMessage,
  prettifyMetadata,
  prettifyObject,
  prettifyModule,
  prettifyTime
};

export const falconPrettyFactory = (options: object) => {
  const opts = Object.assign({}, defaultOptions, options);
  const EOL = opts.crlf ? '\r\n' : '\n';
  const IDENT = '    ';
  const { messageKey } = opts;
  const { timestampKey } = opts;
  const { errorLikeObjectKeys } = opts;
  const errorProps = opts.errorProps.split(',');
  const ignoreKeys = opts.ignore ? new Set(opts.ignore.split(',')) : undefined;
  const colorizer = colors(opts.colorize);
  const { search } = opts;

  if (opts.minimal) {
    return minimal({ IDENT, EOL });
  }

  return (inputData: string | object): string => {
    let log;
    if (!isObject(inputData)) {
      const parsed = jsonParser(inputData as string);
      log = parsed.value;
      if (parsed.err || !isObject(log)) {
        // pass through
        return inputData + EOL;
      }
    } else {
      log = inputData;
    }

    // Short-circuit for spec allowed primitive values.
    if ([null, true, false].includes(log)) {
      return `${log}\n`;
    }

    if (search && !jmespath.search(log, search)) {
      return;
    }

    if (ignoreKeys) {
      log = Object.keys(log)
        .filter(key => !ignoreKeys.has(key))
        .reduce((res, key) => {
          res[key] = log[key];
          return res;
        }, {});
    }

    const prettifiedLevel = prettifyLevel({ log, colorizer });
    const prettifiedMessage = prettifyMessage({ log, messageKey, colorizer });
    const prettifiedMetadata = prettifyMetadata({ log });
    const prettifiedTime = prettifyTime({ log, translateFormat: opts.translateTime, timestampKey });
    const prettifiedModule = prettifyModule({ log, colorizer });

    let line: string = '';
    if (opts.levelFirst && prettifiedLevel) {
      line = `${prettifiedLevel}`;
    }

    if (prettifiedTime && line === '') {
      line = `${prettifiedTime}`;
    } else if (prettifiedTime) {
      line = `${line} ${prettifiedTime}`;
    }

    if (!opts.levelFirst && prettifiedLevel) {
      if (line.length > 0) {
        line = `${line} ${prettifiedLevel}`;
      } else {
        line = prettifiedLevel;
      }
    }

    if (opts.useMetadata && prettifiedMetadata) {
      line = `${line} ${prettifiedMetadata}`;
    }

    if (prettifiedModule) {
      line = `${line} ${prettifiedModule}`;
    }

    if (line.endsWith(':') === false && line !== '') {
      line += ':';
    }

    if (prettifiedMessage) {
      line = `${line} ${prettifiedMessage}`;
    }

    if (line.length > 0) {
      line += EOL;
    }

    if (log.type === 'Error' && (log.stack || log.extensions)) {
      let prettifiedErrorLog: string = '';
      if (log.stack) {
        prettifiedErrorLog = prettifyErrorLog({
          log,
          messageKey,
          colorizer,
          errorLikeKeys: errorLikeObjectKeys,
          errorProperties: errorProps,
          ident: IDENT,
          eol: EOL
        });
      } else if (log.extensions) {
        prettifiedErrorLog = prettifyGraphQLErrorLog({
          log,
          colorizer,
          ident: IDENT,
          eol: EOL
        });
      }
      line += prettifiedErrorLog;
    } else {
      const skipKeys = typeof log[messageKey] === 'string' ? [messageKey] : undefined;
      const prettifiedObject = prettifyObject({
        log,
        skipKeys,
        errorLikeKeys: errorLikeObjectKeys,
        eol: EOL,
        ident: IDENT
      });
      line += prettifiedObject;
    }

    return line;
  };
};
