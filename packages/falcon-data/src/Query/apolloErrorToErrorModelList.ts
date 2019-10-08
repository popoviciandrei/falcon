import { ApolloError } from 'apollo-client';
import { codes } from '@deity/falcon-errors';
import { ErrorModel } from '../Error';

export const apolloErrorToErrorModelList = (error: ApolloError): ErrorModel[] => {
  const { networkError, graphQLErrors } = error;

  if (networkError) {
    return [
      {
        message: networkError.message,
        code: 'UNKNOWN'
      }
    ];
  }

  if (graphQLErrors) {
    return graphQLErrors.reduce<ErrorModel[]>((result, { message, extensions = {} }) => {
      if (extensions.code === codes.BAD_USER_INPUT && extensions.exception) {
        const userInputErrors = Object.keys(extensions.exception).map(x => ({
          message: extensions.exception[x],
          code: extensions.code || 'UNKNOWN',
          path: x
        }));

        return [...result, ...userInputErrors];
      }

      return [...result, { message, code: extensions.code }];
    }, []);
  }

  return [
    {
      message: error.message,
      code: 'UNKNOWN'
    }
  ];
};
