import gql from 'graphql-tag';
import { useMutation, MutationHookOptions } from '@apollo/react-hooks';
import { Mutation, OperationInput } from '@deity/falcon-data';
import { ResetPasswordInput } from '@deity/falcon-shop-extension';

export const RESET_PASSWORD = gql`
  mutation ResetPassword($input: ResetPasswordInput!) {
    resetPassword(input: $input)
  }
`;

export type ResetPasswordResponse = {
  resetPassword: boolean;
};

export class ResetPasswordMutation extends Mutation<ResetPasswordResponse, OperationInput<ResetPasswordInput>> {
  static defaultProps = {
    mutation: RESET_PASSWORD
  };
}

export const useResetPasswordMutation = (
  options: MutationHookOptions<ResetPasswordResponse, OperationInput<ResetPasswordInput>> = {}
) => useMutation(RESET_PASSWORD, options);
