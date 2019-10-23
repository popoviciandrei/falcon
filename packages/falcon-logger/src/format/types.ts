import { ColorizerFn } from './colors';

export type GetSourceFileResolveInput = {
  line: number;
  column: number;
};

export type GetSourceFile = {
  path: string;
  text: string;
  lines: string[];
  resolve: (input: GetSourceFileResolveInput) => GetSourceFileResult;
};

export type GetSourceFileResult = {
  line: number;
  column: number;
  sourceFile: string;
  sourceLine: string;
};

export type MaybeString = undefined | string;

export type PrettifyModuleInput = {
  log: any;
  colorizer: ColorizerFn;
};

export type PrettifyGraphQLErrorLogInput = {
  ident: string;
  eol: string;
} & PrettifyModuleInput;

export type PrettifyErrorLogInput = {
  messageKey?: string;
  errorLikeKeys?: string[];
  errorProperties?: string[];
} & PrettifyGraphQLErrorLogInput;

export type ReadSourceInput = {
  colorizer: ColorizerFn;
  stack: string[];
  setLineNumber?: boolean;
  paddingLines?: number;
};

export type PrettifyObjectInput = {
  log: any;
  ident?: string;
  eol?: string;
  skipKeys?: string[];
  errorLikeKeys?: string[];
  excludeLoggerKeys?: boolean;
};
