import { ApolloError } from 'apollo-client';

export function getErrorCode(error: ApolloError): string | undefined {
  const { graphQLErrors } = error;
  if (Array.isArray(graphQLErrors) && graphQLErrors.length > 0) {
    const { extensions = {} } = graphQLErrors[0];
    const { code } = extensions;

    return code;
  }

  return undefined;
}
