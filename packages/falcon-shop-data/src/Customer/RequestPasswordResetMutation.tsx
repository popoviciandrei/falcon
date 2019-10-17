import gql from 'graphql-tag';
import { useMutation, MutationHookOptions } from '@apollo/react-hooks';
import { Mutation, OperationInput } from '@deity/falcon-data';
import { RequestPasswordResetInput } from '@deity/falcon-shop-extension';

export const REQUEST_PASSWORD_RESET_TOKEN_MUTATION = gql`
  mutation RequestPasswordReset($input: RequestPasswordResetInput!) {
    requestPasswordReset(input: $input)
  }
`;

export type RequestPasswordResetResponse = {
  requestPasswordResetToken: boolean;
};

export class RequestPasswordResetMutation extends Mutation<
  RequestPasswordResetResponse,
  OperationInput<RequestPasswordResetInput>
> {
  static defaultProps = {
    mutation: REQUEST_PASSWORD_RESET_TOKEN_MUTATION
  };
}

export const useRequestPasswordResetMutation = (
  options: MutationHookOptions<RequestPasswordResetResponse, OperationInput<RequestPasswordResetInput>> = {}
) => useMutation(REQUEST_PASSWORD_RESET_TOKEN_MUTATION, options);
