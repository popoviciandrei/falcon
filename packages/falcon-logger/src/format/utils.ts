import bourne from '@hapi/bourne';
import getSource from 'get-source';
import { internals, isObject, prettifyObject as prettifyObjectOriginal } from 'pino-pretty/lib/utils';
import colors from './colors';
import { LOGGER_KEYS, MESSAGE_KEY, ERROR_LIKE_KEYS } from './constants';
import {
  GetSourceFile,
  MaybeString,
  ReadSourceInput,
  PrettifyModuleInput,
  PrettifyErrorLogInput,
  PrettifyObjectInput,
  PrettifyGraphQLErrorLogInput
} from './types';

export {
  prettifyLevel,
  prettifyMessage,
  prettifyMetadata,
  prettifyTime,
  internals,
  isObject
} from 'pino-pretty/lib/utils';

const defaultColorizer = colors();

export type PrettifyModuleFn = (input: PrettifyModuleInput) => MaybeString;
export type PrettifyGraphQLErrorLogFn = (input: PrettifyGraphQLErrorLogInput) => MaybeString;
export type PrettifyErrorLogFn = (input: PrettifyErrorLogInput) => MaybeString;
export type PrettifyObjectFn = (input: PrettifyObjectInput) => MaybeString;
export type ReadSourceFn = (input: ReadSourceInput) => string[];

export const jsonParser: (input: string) => { value?: any; err?: any } = input => {
  try {
    return { value: bourne.parse(input, { protoAction: 'remove' }) };
  } catch (err) {
    return { err };
  }
};

export const prettifyModule: PrettifyModuleFn = ({ log, colorizer = defaultColorizer }) => {
  if (log.module) {
    return `[${colorizer.random(log.module)}]`;
  }
  return undefined;
};

export const prettifyGraphQLErrorLog: PrettifyGraphQLErrorLogFn = ({
  log,
  ident,
  eol,
  colorizer = defaultColorizer
}) => {
  const { path, extensions } = log;

  let result: string = `${eol}`;

  if (extensions.code) {
    result += `GraphQL Error Code: ${colorizer.error(extensions.code)}${eol}`;
  }
  if (path) {
    let pathString: string = '';
    path.forEach(item => {
      const limiter: string = pathString.length ? '.' : '';
      if (Number.isInteger(item)) {
        pathString += `[${item}]`;
      } else {
        pathString += `${limiter}${item}`;
      }
    });
    result += `Path: ${colorizer.error(pathString)}${eol}${eol}`;
  }

  const stack: string[] = extensions && extensions.exception && extensions.exception.stacktrace;
  if (stack && stack.length > 1) {
    const codeLine: string = stack[1];
    // Highlighting the actual code line
    stack[1] = colorizer.error(codeLine);

    const codeSnippet: string[] = readSourceFromStack({
      colorizer,
      stack,
      setLineNumber: true,
      paddingLines: 5
    });
    if (codeSnippet.length) {
      result += `${codeSnippet.join(eol)}${eol}${eol}`;
    }

    const joinedLines = internals.joinLinesWithIndentation({ input: stack.join(eol), ident, eol });
    result += `${ident}${joinedLines}${eol}`;
  }

  return `${result}${eol}`;
};

export const prettifyObject: PrettifyObjectFn = ({
  log,
  ident = '    ',
  eol = '\n',
  skipKeys = [],
  errorLikeKeys = ERROR_LIKE_KEYS,
  excludeLoggerKeys = true
}) =>
  prettifyObjectOriginal({
    input: log,
    ident,
    eol,
    skipKeys: [...LOGGER_KEYS, ...skipKeys],
    errorLikeKeys,
    excludeLoggerKeys
  });

export const prettifyErrorLog: PrettifyErrorLogFn = ({
  log,
  messageKey = MESSAGE_KEY,
  colorizer,
  ident = '    ',
  eol = '\n',
  errorLikeKeys = ERROR_LIKE_KEYS,
  errorProperties = []
}) => {
  const { stack } = log;
  let result: string = '';

  if (stack) {
    const codeSnippet: string[] = readSourceFromStack({
      colorizer,
      stack: stack.split(eol),
      setLineNumber: true,
      paddingLines: 5
    });
    if (codeSnippet.length) {
      result += `${eol}${codeSnippet.join(eol)}${eol}${eol}`;
    }
  }

  const joinedLines = internals.joinLinesWithIndentation({ input: stack, ident, eol });
  result += `${ident}${joinedLines}${eol}`;

  if (errorProperties.length > 0) {
    const excludeProperties = LOGGER_KEYS.concat(messageKey, 'type', 'stack');
    let propertiesToPrint;
    if (errorProperties[0] === '*') {
      // Print all sibling properties except for the standard exclusions.
      propertiesToPrint = Object.keys(log).filter(key => excludeProperties.includes(key) === false);
    } else {
      // Print only sepcified properties unless the property is a standard exclusion.
      propertiesToPrint = errorProperties.filter(key => excludeProperties.includes(key) === false);
    }

    for (let i = 0; i < propertiesToPrint.length; i += 1) {
      const key = propertiesToPrint[i];
      if (key in log === false) continue;
      if (isObject(log[key])) {
        // The nested object may have "logger" type keys but since they are not
        // at the root level of the object being processed, we want to print them.
        // Thus, we invoke with `excludeLoggerKeys: false`.
        const prettifiedObject = prettifyObject({
          log: log[key],
          errorLikeKeys,
          excludeLoggerKeys: false,
          eol,
          ident
        });
        result = `${result}${key}: {${eol}${prettifiedObject}}${eol}`;
        continue;
      }
      result = `${result}${key}: ${log[key]}${eol}`;
    }
  }

  return result;
};

export const readSourceFromStack: ReadSourceFn = ({ colorizer, stack, setLineNumber = false, paddingLines = 0 }) => {
  if (!stack || stack.length < 2) {
    return [];
  }
  const match = stack[1].match(/\((.+):(\d+):(\d+)\)/);
  if (!match) {
    return [];
  }

  const { 1: filePath, 2: codeLine, 3: codeColumn } = match;
  const line: number = Number.parseInt(codeLine, 10);
  const column: number = Number.parseInt(codeColumn, 10);
  const file: GetSourceFile = getSource(filePath) as GetSourceFile;
  const totalLines = file.lines.length;
  const codeLines = [];

  let topLine: number = line;
  let bottomLine: number = line;
  let longestLine: number = 1;

  if (paddingLines) {
    // keeping line numbers within the file range
    topLine = Math.max(topLine - paddingLines, 1);
    bottomLine = Math.min(bottomLine + paddingLines, totalLines);
  }

  for (let i = topLine; i <= bottomLine; i++) {
    let currentLine: string = file.resolve({ line: i, column: i === line ? column : 1 }).sourceLine;
    longestLine = Math.max(longestLine, currentLine.length);
    if (i === line) {
      currentLine = colorizer.error(currentLine);
    } else {
      currentLine = colorizer.message(currentLine);
    }
    codeLines.push(currentLine);
  }

  if (setLineNumber) {
    const colWidth: number = bottomLine.toString().length;
    for (let i = topLine; i <= bottomLine; i++) {
      let numberedLine: string = codeLines.shift();
      numberedLine = ` ${i.toString().padStart(colWidth, ' ')} | ${numberedLine}`;
      longestLine = Math.max(longestLine, numberedLine.length);
      codeLines.push(numberedLine);
    }
  }

  codeLines.push('-'.repeat(longestLine));
  codeLines.unshift('-'.repeat(longestLine));
  codeLines.unshift(`File: ${colorizer.error(file.path)}`);

  return codeLines;
};
