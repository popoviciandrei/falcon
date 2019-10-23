import { useThrowError, ErrorModel, tryGetUserError } from '../Error';

/**
 * React Hook which returns only user errors, and re-throw if any `ApolloError.NetworkError` or unhandled error exist
 * @param e error
 */
export function useGetUserError(e?: Error): [(error: Error) => ErrorModel[], { error: ErrorModel[] }] {
  const throwError = useThrowError();

  /**
   * returns only user errors, and re-throw if any `ApolloError.NetworkError` or unhandled error exist
   * @param {Error} error
   */
  function get<TError extends Error>(error: TError): ErrorModel[] {
    const result = tryGetUserError(error);

    if (result.length === 0) {
      throwError(error);
    }

    return result;
  }

  return [get, { error: e ? get(e) : undefined }];
}
