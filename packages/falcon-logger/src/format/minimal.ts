import colors from './colors';
import * as CONSTANTS from './constants';
import { isObject, jsonParser, prettifyObject, prettifyGraphQLErrorLog, prettifyErrorLog } from './utils';

const colorizer = colors(true);
const messageKey = CONSTANTS.MESSAGE_KEY;
const errorLikeObjectKeys = CONSTANTS.ERROR_LIKE_KEYS;

export default ({ IDENT, EOL }) => inputData => {
  let log;
  let line = '';
  if (!isObject(inputData)) {
    const parsed = jsonParser(inputData);
    log = parsed.value;
    if (parsed.err) {
      // pass through
      return inputData + EOL;
    }
  } else {
    log = inputData;
  }

  // Short-circuit for spec allowed primitive values.
  if ([null, true, false].includes(log)) {
    return log + EOL;
  }

  if (messageKey in log === false) return undefined;
  if (typeof log[messageKey] !== 'string') return undefined;

  line += log[messageKey] + EOL;

  if (log.type === 'Error' && (log.stack || log.extensions)) {
    let prettifiedErrorLog: string = '';
    if (log.stack) {
      prettifiedErrorLog = prettifyErrorLog({
        log,
        messageKey,
        colorizer,
        errorLikeKeys: errorLikeObjectKeys,
        errorProperties: [],
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
