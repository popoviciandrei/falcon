import gql from 'graphql-tag';
import { useMutation, MutationHookOptions } from '@apollo/react-hooks';
import { Mutation } from '@deity/falcon-data';

export const SIGN_OUT = gql`
  mutation SignOut {
    signOut
  }
`;

export type SignOutResponse = { signOut: boolean };

export class SignOutMutation extends Mutation<SignOutResponse> {
  static defaultProps = {
    mutation: SIGN_OUT,
    refetchQueries: ['Customer', 'Cart'],
    awaitRefetchQueries: false
  };
}

export const useSignOutMutation = (options: MutationHookOptions<SignOutResponse> = {}) =>
  useMutation(SIGN_OUT, {
    refetchQueries: ['Customer', 'Cart'],
    awaitRefetchQueries: false,
    ...options
  });
