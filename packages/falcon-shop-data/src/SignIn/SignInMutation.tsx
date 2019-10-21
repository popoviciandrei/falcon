import gql from 'graphql-tag';
import { useMutation, MutationHookOptions } from '@apollo/react-hooks';
import { Mutation, OperationInput } from '@deity/falcon-data';
import { SignInInput } from '@deity/falcon-shop-extension';

export const SIGN_IN_MUTATION = gql`
  mutation SignIn($input: SignInInput!) {
    signIn(input: $input)
  }
`;

export type SignInResponse = { signIn: boolean };

export class SignInMutation extends Mutation<SignInResponse, OperationInput<SignInInput>> {
  static defaultProps = {
    mutation: SIGN_IN_MUTATION,
    refetchQueries: ['Cart', 'CustomerWithAddresses', 'Customer']
  };
}

export const useSignMutation = (options: MutationHookOptions<SignInResponse, OperationInput<SignInInput>> = {}) =>
  useMutation(SIGN_IN_MUTATION, {
    refetchQueries: ['Cart', 'CustomerWithAddresses', 'Customer'],
    ...options
  });
