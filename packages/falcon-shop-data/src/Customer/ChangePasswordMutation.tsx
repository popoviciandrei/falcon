import gql from 'graphql-tag';
import { useMutation, MutationHookOptions } from '@apollo/react-hooks';
import { Mutation, OperationInput } from '@deity/falcon-data';
import { ChangePasswordInput } from '@deity/falcon-shop-extension';

export const CHANGE_PASSWORD = gql`
  mutation changePassword($input: ChangePasswordInput!) {
    changePassword(input: $input)
  }
`;

export type ChangePasswordResponse = {
  changePassword: boolean;
};

export class ChangePasswordMutation extends Mutation<ChangePasswordResponse, OperationInput<ChangePasswordInput>> {
  static defaultProps = {
    mutation: CHANGE_PASSWORD
  };
}

export const useChangePasswordMutation = (
  options: MutationHookOptions<ChangePasswordResponse, OperationInput<ChangePasswordInput>> = {}
) => useMutation(CHANGE_PASSWORD, options);
