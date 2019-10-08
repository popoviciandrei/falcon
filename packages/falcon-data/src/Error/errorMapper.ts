export type ErrorModel = {
  message: string;
  code: string;
  /** path to property (on operation input or operation output) on which error occurs */
  path?: any;
};
